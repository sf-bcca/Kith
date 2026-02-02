import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
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

  it('should update password with valid current password', async () => {
    // First, set a hashed password for the test member
    const hashedPassword = await bcrypt.hash('old-password', 10);
    await pool.query('UPDATE family_members SET password = $1 WHERE id = $2', [hashedPassword, testMemberId]);

    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .send({
        current_password: 'old-password',
        new_password: 'new-password'
      });

    expect(res.status).toBe(200);
    
    // Verify password changed in DB and is hashed
    const dbRes = await pool.query('SELECT password FROM family_members WHERE id = $1', [testMemberId]);
    const newHashedPassword = dbRes.rows[0].password;
    expect(newHashedPassword).not.toBe('new-password');
    expect(await bcrypt.compare('new-password', newHashedPassword)).toBe(true);
  });

  it('should fail to update password with invalid current password', async () => {
    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .send({
        current_password: 'wrong-password',
        new_password: 'even-newer-password'
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Invalid current password');
  });

  it('should update privacy settings', async () => {
    const privacyData = {
      visibility: 'public',
      data_sharing: false
    };

    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .send(privacyData);

    expect(res.status).toBe(200);
    expect(res.body.visibility).toBe('public');
    expect(res.body.data_sharing).toBe(false);
  });

  it('should update app preferences', async () => {
    const prefData = {
      dark_mode: true,
      language: 'es',
      notifications_email: true,
      notifications_push: false
    };

    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .send(prefData);

    expect(res.status).toBe(200);
    expect(res.body.dark_mode).toBe(true);
    expect(res.body.language).toBe('es');
    expect(res.body.notifications_email).toBe(true);
    expect(res.body.notifications_push).toBe(false);
  });
});
