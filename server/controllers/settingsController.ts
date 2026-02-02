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
      email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push 
    } = req.body;
    
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
