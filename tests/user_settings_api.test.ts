import { describe, it, expect, vi } from 'vitest';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../server/index';
import { pool } from '../server/db';

// Mock the database pool
vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn(),
  },
}));

const request = supertest(app);

describe('User Settings API', () => {
  let testMemberId = 'test-id';
  let authToken: string;

  it('should create a member with settings', async () => {
    const password = 'testpassword';
    const newMember = {
      first_name: 'Test',
      last_name: 'User',
      gender: 'other',
      birth_date: '1990-01-01',
      email: 'test@example.com',
      username: 'testuser',
      dark_mode: true,
      language: 'fr',
      visibility: 'public',
      password: password
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const mockCreated = { id: 'test-id', ...newMember, password: hashedPassword, role: 'member' };
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockCreated] });

    const res = await request
      .post('/api/members')
      .send(newMember);

    expect(res.status).toBe(201);
    testMemberId = res.body.id;

    // Mock Login
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockCreated] });
    
    const loginRes = await request
      .post('/api/auth/login')
      .send({
        first_name: newMember.first_name,
        last_name: newMember.last_name,
        birth_date: newMember.birth_date,
        password: password
      });
    
    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.token;
  });

  it('should update member settings via dedicated settings endpoint', async () => {
    const updateData = {
      dark_mode: true,
      language: 'de'
    };

    const mockUpdated = { id: testMemberId, dark_mode: true, language: 'de' };
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockUpdated] });

    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.dark_mode).toBe(true);
    expect(res.body.language).toBe('de');
  });

  it('should update password with valid current password', async () => {
    const currentHashed = await bcrypt.hash('testpassword', 10);
    const mockMember = { id: testMemberId, password: currentHashed };
    
    vi.mocked(pool.query)
      .mockResolvedValueOnce({ rows: [mockMember] }) // controller getSettings (userRes)
      .mockResolvedValueOnce({ rows: [] }) // update password call
      .mockResolvedValueOnce({ rows: [{ id: testMemberId }] }); // final update settings call

    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        current_password: 'testpassword',
        new_password: 'new-password'
      });

    expect(res.status).toBe(200);
  });

  it('should fail to update password with invalid current password', async () => {
    const currentHashed = await bcrypt.hash('testpassword', 10);
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [{ id: testMemberId, password: currentHashed }] });

    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .set('Authorization', `Bearer ${authToken}`)
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

    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [{ id: testMemberId, ...privacyData }] });

    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .set('Authorization', `Bearer ${authToken}`)
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

    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [{ id: testMemberId, ...prefData }] });

    const res = await request
      .put(`/api/settings/${testMemberId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(prefData);

    expect(res.status).toBe(200);
    expect(res.body.dark_mode).toBe(true);
    expect(res.body.language).toBe('es');
    expect(res.body.notifications_email).toBe(true);
    expect(res.body.notifications_push).toBe(false);
  });
});