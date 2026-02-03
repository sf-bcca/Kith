import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db';

const SALT_ROUNDS = 10;

export const getSettings = async (req: Request, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push FROM family_members WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    // Explicitly sanitize as defense in depth
    const { password: _, ...sanitizedSettings } = result.rows[0];
    res.json(sanitizedSettings);
  } catch (err: any) {
    next(err);
  }
};

export const updateSettings = async (req: Request, res: Response, next: any) => {
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
      
      // Verify current password using bcrypt
      if (currentDbPassword) {
        const isMatch = await bcrypt.compare(current_password, currentDbPassword);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid current password' });
        }
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(new_password, SALT_ROUNDS);
      await pool.query('UPDATE family_members SET password = $1 WHERE id = $2', [hashedNewPassword, id]);
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
      RETURNING id, first_name, last_name, maiden_name, birth_date, birth_place, death_date, gender, 
        bio, profile_image, relationships, email, username, dark_mode, language, 
        visibility, data_sharing, notifications_email, notifications_push, role,
        created_at, updated_at`,
      [
        email, username, dark_mode, language, visibility, data_sharing, notifications_email, notifications_push,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    // Explicitly sanitize
    const { password: _, ...sanitizedResult } = result.rows[0];
    res.json(sanitizedResult);
  } catch (err: any) {
    next(err);
  }
};
