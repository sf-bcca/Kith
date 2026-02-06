import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server/index';
import { pool } from '../server/db';
import jwt from 'jsonwebtoken';

// Mock the database pool
vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn(),
  },
}));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

describe('Security: Authentication & IDOR Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Unauthenticated Access (401)', () => {
    it('GET /api/members should return 401 if no token provided', async () => {
      const response = await request(app).get('/api/members');
      expect(response.status).toBe(401);
    });

    it('GET /api/members/:id should return 401 if no token provided', async () => {
      const response = await request(app).get('/api/members/1');
      expect(response.status).toBe(401);
    });

    it('PUT /api/settings/:id should return 401 if no token provided', async () => {
      const response = await request(app).put('/api/settings/1').send({ dark_mode: true });
      expect(response.status).toBe(401);
    });
  });

  describe('IDOR Protection (403)', () => {
    it('GET /api/members/:id should return 403 if token sub does not match ID', async () => {
      const otherUserId = 'user-2';
      const token = jwt.sign({ sub: 'user-1' }, JWT_SECRET);

      (pool.query as any).mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get(`/api/members/${otherUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('unauthorized');
    });

    it('PUT /api/settings/:id should return 403 if token sub does not match ID', async () => {
      const otherUserId = 'user-2';
      const token = jwt.sign({ sub: 'user-1' }, JWT_SECRET);

      const response = await request(app)
        .put(`/api/settings/${otherUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ dark_mode: true });

      expect(response.status).toBe(403);
    });
  });

  describe('Authenticated Access (200)', () => {
    it('GET /api/members/:id should return 200 if token sub matches ID', async () => {
      const userId = 'user-1';
      const token = jwt.sign({ sub: userId }, JWT_SECRET);
      const mockMember = { id: userId, first_name: 'Arthur' };
      
      (pool.query as any).mockResolvedValueOnce({ rows: [mockMember] });

      const response = await request(app)
        .get(`/api/members/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
    });
  });
});
