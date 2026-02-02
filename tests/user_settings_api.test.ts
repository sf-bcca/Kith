import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:8081';
const request = supertest(API_URL);

describe('User Settings API', () => {
  let pool: Pool;
  let testMemberId: string;

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
    if (testMemberId) {
      await pool.query('DELETE FROM family_members WHERE id = $1', [testMemberId]);
    }
    await pool.end();
  });

  it('should create a member with settings', async () => {
    const newMember = {
      first_name: 'Test',
      last_name: 'User',
      gender: 'other',
      birth_date: '1990-01-01',
      email: 'test@example.com',
      username: 'testuser',
      dark_mode: true,
      language: 'fr',
      visibility: 'public'
    };

    const res = await request
      .post('/api/members')
      .send(newMember);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.username).toBe('testuser');
    expect(res.body.dark_mode).toBe(true);
    expect(res.body.language).toBe('fr');
    expect(res.body.visibility).toBe('public');
    
    testMemberId = res.body.id;
  });

  it('should update member settings via dedicated settings endpoint', async () => {
    const updateData = {
      dark_mode: true,
      language: 'de'
    };

    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.dark_mode).toBe(true);
    expect(res.body.language).toBe('de');
  });
});
