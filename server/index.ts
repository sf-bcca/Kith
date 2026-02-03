import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from './db';
import settingsRoutes from './routes/settings';
import { authenticate, authorizeOwner, authorizeAdminOrOwner, authorizeAdmin } from './middleware/auth';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

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
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT ${MEMBER_COLUMNS} FROM family_members WHERE id = $1 AND (visibility = 'public' OR visibility = 'family-only' OR id = $2)`, 
      [id, (req as any).user.id]
    );
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
  try {
    const { id } = req.params;
    
    // Get the member's explicit siblings and parents
    const memberResult = await pool.query(
      'SELECT siblings, relationships FROM family_members WHERE id = $1',
      [id]
    );
    
    if (memberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    const { siblings: explicitSiblings, relationships } = memberResult.rows[0];
    const parents = relationships?.parents || [];
    
    // Get implied siblings (share at least one parent)
    let impliedSiblings: string[] = [];
    if (parents.length > 0) {
      const impliedResult = await pool.query(
        `SELECT DISTINCT id FROM family_members 
         WHERE id <> $1 
         AND relationships::jsonb->'parents' IS NOT NULL
         AND (
           (relationships->'parents')::jsonb && $2::jsonb
         )`,
        [id, JSON.stringify(parents)]
      );
      impliedSiblings = impliedResult.rows.map(row => row.id);
    }
    
    // Combine and deduplicate siblings
    const allSiblingIds = new Set([...(explicitSiblings || []), ...impliedSiblings]);
    
    // Get full sibling records
    if (allSiblingIds.size === 0) {
      return res.json([]);
    }
    
    const siblingsResult = await pool.query(
      `SELECT ${MEMBER_COLUMNS} FROM family_members WHERE id = ANY($1)`,
      [Array.from(allSiblingIds)]
    );
    
    const sanitizedSiblings = siblingsResult.rows.map(({ password, ...rest }: any) => rest);
    res.json(sanitizedSiblings);
  } catch (err: any) {
    next(err);
  }
});

app.post('/api/members', async (req: Request, res: Response, next) => {
  try {
    const { 
      first_name, last_name, maiden_name, birth_date, birth_place, death_date, death_place, gender, bio, profile_image, relationships, siblings, password,
      email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push, role
    } = req.body;

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const result = await pool.query(
      `INSERT INTO family_members 
      (first_name, last_name, maiden_name, birth_date, birth_place, death_date, death_place, gender, bio, profile_image, relationships, siblings, password,
       email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push, role) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) 
      RETURNING ${MEMBER_COLUMNS}`,
      [
        first_name, last_name, maiden_name, birth_date, birth_place, death_date, death_place, gender, bio, profile_image, relationships || {}, siblings || [], hashedPassword,
        email || null, username || null, dark_mode, language, visibility || 'family-only', data_sharing, notifications_email, notifications_push, role || 'member'
      ]
    );

    const newMember = result.rows[0];
    const rels = relationships || {};
    if (rels.parents?.length) {
      for (const parentId of rels.parents) {
        await pool.query(
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
        await pool.query(
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
        await pool.query(
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
    // Handle explicit sibling links
    if (rels.siblings?.length) {
      for (const siblingId of rels.siblings) {
        // Add new member to sibling's siblings list
        await pool.query(
          `UPDATE family_members 
           SET siblings = COALESCE(siblings, '[]')::jsonb || $1::jsonb
           WHERE id = $2 AND NOT (COALESCE(siblings, '[]')::jsonb @> $1::jsonb)`,
          [JSON.stringify([newMember.id]), siblingId]
        );
        // Add sibling to new member's siblings list
        await pool.query(
          `UPDATE family_members 
           SET siblings = COALESCE(siblings, '[]')::jsonb || $1::jsonb
           WHERE id = $2`,
          [JSON.stringify([siblingId]), newMember.id]
        );
      }
    }

    const { password: _, ...sanitizedMember } = newMember;
    res.status(201).json(sanitizedMember);
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A member with these details already exists.' });
    }
    next(err);
  }
});

app.post('/api/auth/login', async (req: Request, res: Response, next) => {
  try {
    const { first_name, last_name, birth_date, password } = req.body;
    
    // Find member by name and birth date
    const result = await pool.query(
      'SELECT * FROM family_members WHERE first_name = $1 AND last_name = $2 AND birth_date = $3',
      [first_name, last_name, birth_date]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const member = result.rows[0];

    // Check password using bcrypt
    if (member.password) {
      const isMatch = await bcrypt.compare(password, member.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } else if (password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT with role
    const token = jwt.sign(
      { sub: member.id, role: member.role }, 
      getJwtSecret(), 
      { expiresIn: '24h' }
    );

    // Exclude password from response
    const { password: _, ...memberWithoutPassword } = member;
    res.json({ member: memberWithoutPassword, token });
  } catch (err: any) {
    next(err);
  }
});

app.put('/api/members/:id', authenticate, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const { 
      first_name, last_name, maiden_name, birth_date, birth_place, death_date, death_place, gender, bio, profile_image, relationships, siblings, password,
      email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push, role
    } = req.body;
    
    let hashedPassword = password;
    if (password && !password.startsWith('$2b$')) { // Basic check to avoid re-hashing
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    // Only admins can change roles
    const targetRole = (req as any).user.role === 'admin' ? role : undefined;

    const result = await pool.query(
      `UPDATE family_members SET 
      first_name = COALESCE($1, first_name), 
      last_name = COALESCE($2, last_name), 
      maiden_name = COALESCE($3, maiden_name), 
      birth_date = COALESCE($4, birth_date), 
      birth_place = COALESCE($5, birth_place),
      death_date = COALESCE($6, death_date), 
      death_place = COALESCE($7, death_place),
      gender = COALESCE($8, gender), 
      bio = COALESCE($9, bio), 
      profile_image = COALESCE($10, profile_image), 
      relationships = COALESCE($11, relationships),
      siblings = COALESCE($12, siblings),
      password = CASE WHEN $13::VARCHAR IS NOT NULL AND $13::VARCHAR <> '' THEN $13::VARCHAR ELSE password END,
      email = COALESCE($14, email),
      username = COALESCE($15, username),
      dark_mode = COALESCE($16, dark_mode),
      language = COALESCE($17, language),
      visibility = COALESCE($18, visibility),
      data_sharing = COALESCE($19, data_sharing),
      notifications_email = COALESCE($20, notifications_email),
      notifications_push = COALESCE($21, notifications_push),
      role = COALESCE($22, role)
      WHERE id = $23 
      RETURNING ${MEMBER_COLUMNS}`,
      [
        first_name, last_name, maiden_name, birth_date, birth_place, death_date, death_place, gender, bio, profile_image, relationships, siblings, hashedPassword,
        email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push,
        targetRole,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    // Explicitly sanitize
    const { password: _, ...sanitizedMember } = result.rows[0];
    res.json(sanitizedMember);
  } catch (err: any) {
    next(err);
  }
});

app.post('/api/members/link', authenticate, async (req: Request, res: Response, next) => {
  try {
    const { memberId, relativeId, relationshipType } = req.body;

    if (!memberId || !relativeId || !relationshipType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (memberId === relativeId) {
      return res.status(400).json({ error: 'Cannot link a member to themselves' });
    }

    // Determine reciprocal relationship
    let memberKey: string; // Key to update in memberId's relationships
    let relativeKey: string; // Key to update in relativeId's relationships

    switch (relationshipType) {
      case 'parent': // relativeId is parent of memberId
        memberKey = 'parents';
        relativeKey = 'children';
        break;
      case 'child': // relativeId is child of memberId
        memberKey = 'children';
        relativeKey = 'parents';
        break;
      case 'spouse': // relativeId is spouse of memberId
        memberKey = 'spouses';
        relativeKey = 'spouses';
        break;
      default:
        return res.status(400).json({ error: 'Invalid relationship type' });
    }

    // Update memberId's relationships
    await pool.query(
      `UPDATE family_members 
       SET relationships = jsonb_set(
         COALESCE(relationships, '{}')::jsonb,
         '{${memberKey}}',
         COALESCE(relationships->'${memberKey}', '[]')::jsonb || $1::jsonb
       )
       WHERE id = $2 AND NOT (COALESCE(relationships->'${memberKey}', '[]')::jsonb @> $1::jsonb)`,
      [JSON.stringify([relativeId]), memberId]
    );

    // Update relativeId's relationships
    await pool.query(
      `UPDATE family_members 
       SET relationships = jsonb_set(
         COALESCE(relationships, '{}')::jsonb,
         '{${relativeKey}}',
         COALESCE(relationships->'${relativeKey}', '[]')::jsonb || $1::jsonb
       )
       WHERE id = $2 AND NOT (COALESCE(relationships->'${relativeKey}', '[]')::jsonb @> $1::jsonb)`,
      [JSON.stringify([memberId]), relativeId]
    );

    res.json({ message: 'Members linked successfully' });
  } catch (err: any) {
    next(err);
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
