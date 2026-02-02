import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

dotenv.config({ path: path.join(__dirname, '../.env') });

describe('Database Schema - User Settings', () => {
  let pool: Pool;

  beforeAll(() => {
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432'),
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should have user settings columns in the family_members table', async () => {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'family_members' 
      AND column_name IN (
        'email',
        'username',
        'dark_mode', 
        'language', 
        'visibility', 
        'data_sharing', 
        'notifications_email', 
        'notifications_push'
      )
    `);
    
    const columns = res.rows.map(row => row.column_name);
    expect(columns).toContain('email');
    expect(columns).toContain('username');
    expect(columns).toContain('dark_mode');
    expect(columns).toContain('language');
    expect(columns).toContain('visibility');
    expect(columns).toContain('data_sharing');
    expect(columns).toContain('notifications_email');
    expect(columns).toContain('notifications_push');
  });
});
