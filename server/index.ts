import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { pool } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

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
      database: 'disconnected',
      message: err.message 
    });
  }
});

app.get('/api/members', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM family_members ORDER BY last_name, first_name');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/members/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM family_members WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/members', async (req: Request, res: Response) => {
  try {
    const { 
      first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profile_image, relationships, password,
      email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push
    } = req.body;
    const result = await pool.query(
      `INSERT INTO family_members 
      (first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profile_image, relationships, password,
       email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
      RETURNING *`,
      [
        first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profile_image, relationships || {}, password,
        email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req: Request, res: Response) => {
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

    // Simple password check (should be hashed in production)
    if (member.password && member.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.json(member);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/members/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profile_image, relationships, password,
      email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push
    } = req.body;
    
    const result = await pool.query(
      `UPDATE family_members SET 
      first_name = COALESCE($1, first_name), 
      last_name = COALESCE($2, last_name), 
      maiden_name = COALESCE($3, maiden_name), 
      birth_date = COALESCE($4, birth_date), 
      death_date = COALESCE($5, death_date), 
      gender = COALESCE($6, gender), 
      bio = COALESCE($7, bio), 
      profile_image = COALESCE($8, profile_image), 
      relationships = COALESCE($9, relationships),
      password = COALESCE($10, password),
      email = COALESCE($11, email),
      username = COALESCE($12, username),
      dark_mode = COALESCE($13, dark_mode),
      language = COALESCE($14, language),
      visibility = COALESCE($15, visibility),
      data_sharing = COALESCE($16, data_sharing),
      notifications_email = COALESCE($17, notifications_email),
      notifications_push = COALESCE($18, notifications_push)
      WHERE id = $19 
      RETURNING *`,
      [
        first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profile_image, relationships, password,
        email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/members/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM family_members WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully', member: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/activities', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM activities ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/activities/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = req.body;
    
    // Check if activity exists
    const checkResult = await pool.query('SELECT * FROM activities WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const result = await pool.query(
      'UPDATE activities SET comments = comments || $1::jsonb WHERE id = $2 RETURNING *',
      [JSON.stringify(comment), id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start server if not imported
if (require.main === module) {
  app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    try {
      await pool.query('SELECT NOW()');
      console.log('Connected to PostgreSQL');
    } catch (err) {
      console.error('Failed to connect to PostgreSQL on startup', err);
    }
  });
}

export default app;
