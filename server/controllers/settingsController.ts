import { Request, Response } from 'express';
import { pool } from '../db';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push FROM family_members WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push,
      current_password, new_password
    } = req.body;

    // Handle password update if requested
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }

      const userRes = await pool.query('SELECT password FROM family_members WHERE id = $1', [id]);
      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'Member not found' });
      }

      const currentDbPassword = userRes.rows[0].password;
      // Simple equality check for now (should use bcrypt in production)
      if (currentDbPassword && currentDbPassword !== current_password) {
        return res.status(401).json({ error: 'Invalid current password' });
      }

      await pool.query('UPDATE family_members SET password = $1 WHERE id = $2', [new_password, id]);
    }
    
    const result = await pool.query(
      `UPDATE family_members SET 
      email = COALESCE($1, email),
      username = COALESCE($2, username),
      dark_mode = COALESCE($3, dark_mode),
      language = COALESCE($4, language),
      visibility = COALESCE($5, visibility),
      data_sharing = COALESCE($6, data_sharing),
      notifications_email = COALESCE($7, notifications_email),
      notifications_push = COALESCE($8, notifications_push)
      WHERE id = $9 
      RETURNING *`,
      [
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
};
