import express, { Request, Response, NextFunction } from 'express';
// DEBUG: Triggering reload 1
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from './db';
import settingsRoutes from './routes/settings';
import { authenticate, authorizeOwner, authorizeAdminOrOwner, authorizeAdmin, AuthRequest } from './middleware/auth';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

const SALT_ROUNDS = 10;
const MEMBER_COLUMNS = `
  id, first_name, last_name, maiden_name, birth_date, birth_place, death_date, death_place, gender, 
  bio, profile_image, relationships, siblings, email, username, dark_mode, language, 
  visibility, data_sharing, notifications_email, notifications_push, role,
  created_at, updated_at
`;

app.use(cors());
app.use(express.json());

app.use('/api/settings', settingsRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT NOW()');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (err: any) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected'
    });
  }
});

app.get('/api/init-check', async (req: Request, res: Response, next) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM family_members');
    const count = parseInt(result.rows[0].count);
    res.json({ initialized: count > 0 });
  } catch (err: any) {
    next(err);
  }
});

app.get('/api/members', authenticate, async (req: Request, res: Response, next) => {
  try {
    const { ids } = req.query;
    let query = `SELECT ${MEMBER_COLUMNS} FROM family_members WHERE (visibility = 'public' OR visibility = 'family-only' OR id = $1)`;
    let params: any[] = [(req as any).user.id];

    if (ids) {
      const idArray = (ids as string).split(',');
      query += ` AND id = ANY($2)`;
      params.push(idArray);
    }

    query += ` ORDER BY last_name, first_name`;
    const result = await pool.query(query, params);
    // Explicitly sanitize results as defense in depth
    const sanitizedRows = result.rows.map(({ password, ...rest }: any) => rest);
    res.json(sanitizedRows);
  } catch (err: any) {
    next(err);
  }
});

app.get('/api/members/:id', authenticate, async (req: Request, res: Response, next) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  try {
    let result = await pool.query(
      `SELECT ${MEMBER_COLUMNS} FROM family_members WHERE id = $1 AND (visibility = 'public' OR visibility = 'family-only' OR id = $2)`, 
      [id, userId]
    );

    // Removed setTimeout logic as per track requirement
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found or unauthorized' });
    }
    // Explicitly sanitize as defense in depth
    const { password, ...sanitizedMember } = result.rows[0];
    res.json(sanitizedMember);
  } catch (err: any) {
    next(err);
  }
});

app.get('/api/members/:id/siblings', authenticate, async (req: Request, res: Response, next) => {
  const { id } = req.params;
  try {
    // Removed setTimeout logic
    const memberResult = await pool.query(
      'SELECT first_name, last_name, siblings, relationships FROM family_members WHERE id = $1',
      [id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    const { siblings: rawSiblings, relationships } = memberResult.rows[0];
    
    // Normalize siblings to objects
    const explicitSiblings = Array.isArray(rawSiblings) 
      ? rawSiblings.map((s: any) => typeof s === 'string' ? { id: s, type: 'Full' } : s)
      : [];
      
    const parents = relationships?.parents || [];
    
    // Get implied siblings (share at least one parent)
    let impliedIds: string[] = [];
    if (parents.length > 0) {
      const impliedResult = await pool.query(
        `SELECT DISTINCT id FROM family_members 
         WHERE id <> $1 
         AND relationships::jsonb->'parents' IS NOT NULL
         AND (
           (relationships->'parents')::jsonb ?| $2::text[]
         )`,
        [id, parents]
      );
      impliedIds = impliedResult.rows.map(row => row.id);
    }
    
    // Merge explicit and implied. Explicit takes precedence for metadata (type).
    const siblingMap = new Map<string, any>();
    
    // Add implied first as generic 'Full' (or we could derive type based on shared parents, but keep simple for now)
    // Actually, implied siblings are "Full" by default unless specified otherwise in explicit list?
    // For now, implied just ensures they are in the list.
    impliedIds.forEach(sid => siblingMap.set(sid, { id: sid, type: 'Full' }));
    
    // Overwrite with explicit settings
    explicitSiblings.forEach((s: any) => siblingMap.set(s.id, s));
    
    if (siblingMap.size === 0) {
      return res.json([]);
    }
    
    const siblingsResult = await pool.query(
      `SELECT ${MEMBER_COLUMNS} FROM family_members WHERE id = ANY($1)`,
      [Array.from(siblingMap.keys())]
    );
    
    const sanitizedSiblings = siblingsResult.rows.map(({ password, ...rest }: any) => {
        // Attach the type info to the returned object?
        // The API contract usually returns FamilyMember objects. 
        // But the consumer might want to know the relationship type.
        // For now, return standard member objects. The frontend might need to fetch the relationship details separately or we augment here.
        // The test expects [{id: 's1', type: 'Full'}] ?? No, test expects standard members?
        // Wait, the test: expect(response.body.map((s: any) => s.id)).toContain('s1');
        // It doesn't check the structure deeply for type property on the root.
        // However, the task says: "Modify siblings column ... to store ... { id, type }".
        // This endpoint returns *members* (the sibling profiles), NOT the relationship objects.
        // But maybe it should return the relationship metadata?
        // Current implementation returns full member profiles.
        // I will return the member profiles as before.
        return rest;
    });
    res.json(sanitizedSiblings);
  } catch (err: any) {
    next(err);
  }
});

// Helper for Sibling Handling
type SiblingLink = { id: string; type: string };
function normalizeSiblings(siblings: any[] | null): SiblingLink[] {
  if (!Array.isArray(siblings)) return [];
  return siblings.map(s => typeof s === 'string' ? { id: s, type: 'Full' } : { id: s.id, type: s.type || 'Full' });
}

app.post('/api/members', async (req: Request, res: Response, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { 
      first_name, last_name, maiden_name, birth_date, birth_place, death_date, death_place, gender, bio, profile_image, relationships, siblings, password,
      email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push, role
    } = req.body;

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    // Normalize siblings
    const normalizedSiblings = normalizeSiblings(siblings);

    const result = await client.query(
      `INSERT INTO family_members 
      (first_name, last_name, maiden_name, birth_date, birth_place, death_date, death_place, gender, bio, profile_image, relationships, siblings, password,
       email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push, role) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12::jsonb, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) 
      RETURNING ${MEMBER_COLUMNS}`,
      [
        first_name, last_name, maiden_name, birth_date, birth_place, death_date, death_place, gender, bio, profile_image, 
        relationships ? JSON.stringify(relationships) : JSON.stringify({}), 
        JSON.stringify(normalizedSiblings), 
        hashedPassword,
        email || null, username || null, dark_mode, language, visibility || 'family-only', data_sharing, notifications_email, notifications_push, role || 'member'
      ]
    );

    const newMember = result.rows[0];
    const rels = relationships || {};

    // Reciprocal Parent/Child/Spouse updates
    if (rels.parents?.length) {
      for (const parentId of rels.parents) {
        await client.query(
          `UPDATE family_members 
           SET relationships = jsonb_set(
             COALESCE(relationships, '{}')::jsonb,
             '{children}',
             COALESCE(relationships->'children', '[]')::jsonb || $1::jsonb
           )
           WHERE id = $2`,
          [JSON.stringify([newMember.id]), parentId]
        );
      }
    }
    if (rels.children?.length) {
      for (const childId of rels.children) {
        await client.query(
          `UPDATE family_members 
           SET relationships = jsonb_set(
             COALESCE(relationships, '{}')::jsonb,
             '{parents}',
             COALESCE(relationships->'parents', '[]')::jsonb || $1::jsonb
           )
           WHERE id = $2`,
          [JSON.stringify([newMember.id]), childId]
        );
      }
    }
    if (rels.spouses?.length) {
      for (const spouseId of rels.spouses) {
        await client.query(
          `UPDATE family_members 
           SET relationships = jsonb_set(
             COALESCE(relationships, '{}')::jsonb,
             '{spouses}',
             COALESCE(relationships->'spouses', '[]')::jsonb || $1::jsonb
           )
           WHERE id = $2`,
          [JSON.stringify([newMember.id]), spouseId]
        );
      }
    }

    // Reciprocal Sibling updates
    for (const sib of normalizedSiblings) {
      // Add new member to sibling's list (using the same type? Or reciprocal? Assuming symmetric for now)
      // Check if already linked to avoid duplicates
      // Note: We store {id, type}. To append safely, we must read-modify-write or use smart JSONB logic.
      // Postgres JSONB helpers are limited for searching inside array of objects.
      // Safest: Append if not exists.
      
      // We will perform a check-and-update or just blind append (duplicates handled by UI?)
      // Better: Read sibling, add if missing, write back.
      // Within transaction, this is safe.
      
      const sibRes = await client.query('SELECT siblings FROM family_members WHERE id = $1 FOR UPDATE', [sib.id]);
      if (sibRes.rows.length > 0) {
        let sibsList = normalizeSiblings(sibRes.rows[0].siblings);
        if (!sibsList.find(s => s.id === newMember.id)) {
          sibsList.push({ id: newMember.id, type: sib.type }); // Symmetric type
          await client.query('UPDATE family_members SET siblings = $1 WHERE id = $2', [JSON.stringify(sibsList), sib.id]);
        }
      }
    }

    await client.query('COMMIT');
    const { password: _, ...sanitizedMember } = newMember;
    res.status(201).json(sanitizedMember);
  } catch (err: any) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A member with these details already exists.' });
    }
    next(err);
  } finally {
    client.release();
  }
});

app.post('/api/auth/login', async (req: Request, res: Response, next) => {
  try {
    const { first_name, last_name, birth_date, password } = req.body;
    const result = await pool.query(
      'SELECT * FROM family_members WHERE first_name = $1 AND last_name = $2 AND birth_date = $3',
      [first_name, last_name, birth_date]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const member = result.rows[0];
    if (member.password) {
      const isMatch = await bcrypt.compare(password, member.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } else if (password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign(
      { sub: member.id, role: member.role }, 
      getJwtSecret(), 
      { expiresIn: '24h' }
    );
    const { password: _, ...memberWithoutPassword } = member;
    res.json({ member: memberWithoutPassword, token });
  } catch (err: any) {
    next(err);
  }
});

app.put('/api/members/:id', authenticate, async (req: Request, res: Response, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    
    // Lock and fetch current
    const currentRes = await client.query('SELECT * FROM family_members WHERE id = $1 FOR UPDATE', [id]);
    if (currentRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Member not found' });
    }
    const currentMember = currentRes.rows[0];

    // Merge request body with current member to handle partial updates and allow NULLs
    const merged = { ...currentMember, ...req.body };
    // Careful: req.body might not have all fields.
    // If a field is explicitly null in req.body, it should be null in merged.
    // If undefined, it should be ignored (keep current).
    // The spread {...current, ...body} does this correctly for null/value. 
    // But if body has undefined, it might override with undefined? 
    // JSON.stringify/parse usually removes undefined. Express req.body typically doesn't have undefined keys.
    // However, we should be explicit for safety.
    
    const fields = [
      'first_name', 'last_name', 'maiden_name', 'birth_date', 'birth_place', 
      'death_date', 'death_place', 'gender', 'bio', 'profile_image', 
      'email', 'username', 'dark_mode', 'language', 'visibility', 
      'data_sharing', 'notifications_email', 'notifications_push', 'role'
    ];
    
    const updateValues: any = {};
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        updateValues[f] = req.body[f];
      } else {
        updateValues[f] = currentMember[f];
      }
    });

    // Handle Password
    if (req.body.password && !req.body.password.startsWith('$2b$')) {
      updateValues.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    } else {
      updateValues.password = currentMember.password;
    }

    // Handle Siblings Logic
    let newSiblingsList: SiblingLink[] = normalizeSiblings(currentMember.siblings);
    
    if (req.body.siblings !== undefined) {
      if (Array.isArray(req.body.siblings)) {
        const incomingSiblings = normalizeSiblings(req.body.siblings);
        const currentSiblings = normalizeSiblings(currentMember.siblings);
        
        // Determine Added and Removed
        const currentIds = new Set(currentSiblings.map(s => s.id));
        const incomingIds = new Set(incomingSiblings.map(s => s.id));
        
        const added = incomingSiblings.filter(s => !currentIds.has(s.id));
        const removed = currentSiblings.filter(s => !incomingIds.has(s.id));
        
        // Reciprocal Updates
        // Added: Add 'id' to their lists
        for (const s of added) {
          const sRes = await client.query('SELECT siblings FROM family_members WHERE id = $1 FOR UPDATE', [s.id]);
          if (sRes.rows.length > 0) {
            let sList = normalizeSiblings(sRes.rows[0].siblings);
            if (!sList.find(x => x.id === id)) {
              sList.push({ id, type: s.type });
              await client.query('UPDATE family_members SET siblings = $1 WHERE id = $2', [JSON.stringify(sList), s.id]);
            }
          }
        }
        
        // Removed: Remove 'id' from their lists
        for (const s of removed) {
          const sRes = await client.query('SELECT siblings FROM family_members WHERE id = $1 FOR UPDATE', [s.id]);
          if (sRes.rows.length > 0) {
            let sList = normalizeSiblings(sRes.rows[0].siblings);
            const newList = sList.filter(x => x.id !== id);
            if (sList.length !== newList.length) {
              await client.query('UPDATE family_members SET siblings = $1 WHERE id = $2', [JSON.stringify(newList), s.id]);
            }
          }
        }
        
        newSiblingsList = incomingSiblings;
      } else if (typeof req.body.siblings === 'object') {
        // Special action handling (legacy/helper)
        const { action, siblingId } = req.body.siblings;
        if (action === 'remove' && siblingId) {
          newSiblingsList = newSiblingsList.filter(s => s.id !== siblingId);
          // Reciprocal remove
           const sRes = await client.query('SELECT siblings FROM family_members WHERE id = $1 FOR UPDATE', [siblingId]);
           if (sRes.rows.length > 0) {
             let sList = normalizeSiblings(sRes.rows[0].siblings);
             const newList = sList.filter(x => x.id !== id);
             await client.query('UPDATE family_members SET siblings = $1 WHERE id = $2', [JSON.stringify(newList), siblingId]);
           }
        }
      }
    }

    // Role Security
    if (updateValues.role && (req as any).user.role !== 'admin') {
      updateValues.role = currentMember.role; // Ignore role change if not admin
    }

    // Execute Main Update
    const result = await client.query(
      `UPDATE family_members SET 
      first_name = $1, last_name = $2, maiden_name = $3, birth_date = $4, birth_place = $5,
      death_date = $6, death_place = $7, gender = $8, bio = $9, profile_image = $10, 
      relationships = $11::jsonb, siblings = $12::jsonb, password = $13,
      email = $14, username = $15, dark_mode = $16, language = $17, visibility = $18,
      data_sharing = $19, notifications_email = $20, notifications_push = $21, role = $22
      WHERE id = $23 
      RETURNING ${MEMBER_COLUMNS}`,
      [
        updateValues.first_name, updateValues.last_name, updateValues.maiden_name, updateValues.birth_date, updateValues.birth_place,
        updateValues.death_date, updateValues.death_place, updateValues.gender, updateValues.bio, updateValues.profile_image,
        req.body.relationships ? JSON.stringify(req.body.relationships) : JSON.stringify(currentMember.relationships || {}),
        JSON.stringify(newSiblingsList),
        updateValues.password,
        updateValues.email, updateValues.username, updateValues.dark_mode, updateValues.language, updateValues.visibility,
        updateValues.data_sharing, updateValues.notifications_email, updateValues.notifications_push, updateValues.role,
        id
      ]
    );

    await client.query('COMMIT');
    const { password: _, ...sanitizedMember } = result.rows[0];
    res.json(sanitizedMember);

  } catch (err: any) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

app.post('/api/members/link', authenticate, async (req: Request, res: Response, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { memberId, relativeId, relationshipType } = req.body;

    if (!memberId || !relativeId || !relationshipType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (memberId === relativeId) {
      return res.status(400).json({ error: 'Cannot link a member to themselves' });
    }

    // Helper to update jsonb array field
    const addRelation = async (targetId: string, field: string, valueId: string) => {
       await client.query(
        `UPDATE family_members 
         SET relationships = jsonb_set(
           COALESCE(relationships, '{}')::jsonb,
           '{${field}}',
           COALESCE(relationships->'${field}', '[]')::jsonb || $1::jsonb
         )
         WHERE id = $2 AND NOT (COALESCE(relationships->'${field}', '[]')::jsonb @> $1::jsonb)`,
        [JSON.stringify([valueId]), targetId]
      );
    };

    switch (relationshipType) {
      case 'parent': // relativeId is parent of memberId
        await addRelation(memberId, 'parents', relativeId);
        await addRelation(relativeId, 'children', memberId);
        break;
      case 'child': // relativeId is child of memberId
        await addRelation(memberId, 'children', relativeId);
        await addRelation(relativeId, 'parents', memberId);
        break;
      case 'spouse': // relativeId is spouse of memberId
        await addRelation(memberId, 'spouses', relativeId);
        await addRelation(relativeId, 'spouses', memberId);
        break;
      case 'sibling':
        // Update both members' siblings lists (transactional read-modify-write for objects)
        const updateSib = async (target: string, value: string) => {
           const res = await client.query('SELECT siblings FROM family_members WHERE id = $1 FOR UPDATE', [target]);
           if (res.rows.length > 0) {
             const list = normalizeSiblings(res.rows[0].siblings);
             if (!list.find(s => s.id === value)) {
               list.push({ id: value, type: 'Full' });
               await client.query('UPDATE family_members SET siblings = $1 WHERE id = $2', [JSON.stringify(list), target]);
             }
           }
        };
        await updateSib(memberId, relativeId);
        await updateSib(relativeId, memberId);
        break;
      default:
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Invalid relationship type' });
    }

    await client.query('COMMIT');
    res.json({ message: 'Members linked successfully' });
  } catch (err: any) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

app.delete('/api/members/:id', authenticate, authorizeAdminOrOwner, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM family_members WHERE id = $1 RETURNING ${MEMBER_COLUMNS}`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully', member: result.rows[0] });
  } catch (err: any) {
    next(err);
  }
});

app.get('/api/admin/stats', authenticate, authorizeAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const membersRes = await pool.query('SELECT COUNT(*) FROM family_members');
    const activitiesRes = await pool.query('SELECT COUNT(*) FROM activities');
    const pendingRes = await pool.query("SELECT COUNT(*) FROM activities WHERE status = 'pending'");

    res.json({
      totalMembers: parseInt(membersRes.rows[0].count),
      totalActivities: parseInt(activitiesRes.rows[0].count),
      pendingApprovals: parseInt(pendingRes.rows[0].count),
    });
  } catch (err: any) {
    next(err);
  }
});

app.get('/api/discover/summary', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use UTC to ensure consistent results regardless of server timezone
    const now = new Date();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();

    const onThisDayRes = await pool.query(
      `SELECT id, first_name, last_name, birth_date, death_date, profile_image 
       FROM family_members 
       WHERE (EXTRACT(MONTH FROM birth_date) = $1 AND EXTRACT(DAY FROM birth_date) = $2)
          OR (death_date IS NOT NULL AND EXTRACT(MONTH FROM death_date) = $1 AND EXTRACT(DAY FROM death_date) = $2)`,
      [month, day]
    );

    const hintsRes = await pool.query(
      `SELECT id, first_name, last_name, profile_image, bio 
       FROM family_members 
       WHERE (profile_image IS NULL OR profile_image = '') 
          OR (bio IS NULL OR bio = '')
       LIMIT 5`,
      []
    );

    const hints = hintsRes.rows.map(m => {
      if (!m.profile_image || m.profile_image === '') {
        return { type: 'missing_info', subtype: 'photo', memberId: m.id, name: `${m.first_name} ${m.last_name}`, message: `Add a photo for ${m.first_name}` };
      }
      return { type: 'missing_info', subtype: 'bio', memberId: m.id, name: `${m.first_name} ${m.last_name}`, message: `Add a biography for ${m.first_name}` };
    });

    res.json({
      onThisDay: onThisDayRes.rows,
      hints: hints
    });
  } catch (err: any) {
    next(err);
  }
});

app.get('/api/activities', async (req: Request, res: Response, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM activities';
    let params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY timestamp DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err: any) {
    next(err);
  }
});

app.post('/api/activities', authenticate, async (req: Request, res: Response, next) => {
  try {
    const { type, content, image_url, target_id } = req.body;
    
    const validTypes = ['photo_added', 'member_updated', 'member_added', 'milestone'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid activity type' });
    }

    const member_id = (req as any).user.id;

    const result = await pool.query(
      `INSERT INTO activities (type, member_id, content, image_url, target_id, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [type, member_id, content || {}, image_url, target_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    next(err);
  }
});

app.patch('/api/activities/:id/approve', authenticate, authorizeAdmin, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE activities SET status = 'approved' WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    next(err);
  }
});

app.post('/api/activities/:id/comments', async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const { authorId, text } = req.body;

    if (!authorId || !text) {
      return res.status(400).json({ error: 'Comment must include authorId and text' });
    }
    
    // Check if activity exists
    const checkResult = await pool.query('SELECT * FROM activities WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const comment = {
      id: crypto.randomUUID(),
      authorId,
      text,
      timestamp: new Date().toISOString()
    };

    const result = await pool.query(
      'UPDATE activities SET comments = comments || $1::jsonb WHERE id = $2 RETURNING *',
      [JSON.stringify(comment), id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    next(err);
  }
});

app.use(errorHandler);

// Start server if not imported
if (require.main === module) {
  app.listen(Number(port), '0.0.0.0', async () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
    try {
      await pool.query('SELECT NOW()');
      console.log('Connected to PostgreSQL');
    } catch (err) {
      console.error('Failed to connect to PostgreSQL on startup', err);
    }
  });
}

export default app;