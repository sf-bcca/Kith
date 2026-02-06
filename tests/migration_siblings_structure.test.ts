import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { pool } from '../server/db';
import fs from 'fs';
import path from 'path';

describe('Migration 011: Enhance Siblings JSON', () => {
  const testId1 = '00000000-0000-0000-0000-000000000001';
  const testId2 = '00000000-0000-0000-0000-000000000002';

  beforeAll(async () => {
    // Clean up
    await pool.query('DELETE FROM family_members WHERE id IN ($1, $2)', [testId1, testId2]);

    // Insert test data with OLD format (array of strings)
    // We explicitly cast to jsonb to simulate the old state
    await pool.query(`
      INSERT INTO family_members (id, first_name, last_name, gender, birth_date, siblings)
      VALUES
      ($1, 'TestMigrate1', 'User', 'male', '2000-01-01', $2::jsonb)
    `, [testId1, JSON.stringify([testId2])]);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM family_members WHERE id IN ($1, $2)', [testId1, testId2]);
    // We don't end the pool here because other tests might need it if running in parallel,
    // but vitest usually runs files in isolation or we should rely on vitest teardown.
    // However, for this standalone file check, we can close it or let the process exit.
    // pool.end() is tricky with vitest watch mode.
  });

  it('should convert siblings array of strings to array of objects', async () => {
    const migrationPath = path.join(__dirname, '../server/migrations/011_enhance_siblings_json.sql');
    
    // Check if file exists (part of the test failure if not)
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found at ${migrationPath}`);
    }

    // Read migration file
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // Run migration
    await pool.query(migrationSql);

    // Verify
    const res = await pool.query('SELECT siblings FROM family_members WHERE id = $1', [testId1]);
    const siblings = res.rows[0].siblings;

    expect(siblings).toHaveLength(1);
    expect(siblings[0]).toEqual({
      id: testId2,
      type: 'Full'
    });
  });
});
