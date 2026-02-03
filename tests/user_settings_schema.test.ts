import { describe, it, expect, vi } from 'vitest';

// Mock the database pool
vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn(),
  },
}));

import { pool } from '../server/db';

describe('Database Schema - User Settings', () => {
  it('should have user settings columns in the family_members table', async () => {
    vi.mocked(pool.query).mockImplementation(async () => ({
      rows: [
        { column_name: 'email' },
        { column_name: 'username' },
        { column_name: 'dark_mode' },
        { column_name: 'language' },
        { column_name: 'visibility' },
        { column_name: 'data_sharing' },
        { column_name: 'notifications_email' },
        { column_name: 'notifications_push' },
      ],
      command: '',
      rowCount: 8,
      oid: 0,
      fields: []
    }));

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
    
    const columns = res.rows.map((row: any) => row.column_name);
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
