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
const adminToken = jwt.sign({ sub: 'admin-id', role: 'admin' }, JWT_SECRET);
const userToken = jwt.sign({ sub: 'user-id', role: 'member' }, JWT_SECRET);

describe('Admin API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/stats', () => {
    it('should return network statistics for admins', async () => {
      vi.mocked(pool.query)
        .mockResolvedValueOnce({ rows: [{ count: '100' }] }) // members
        .mockResolvedValueOnce({ rows: [{ count: '50' }] })  // activities
        .mockResolvedValueOnce({ rows: [{ count: '5' }] });  // pending

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        totalMembers: 100,
        totalActivities: 50,
        pendingApprovals: 5,
      });
    });

    it('should return 403 for non-admins', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/activities', () => {
    it('should support status filtering', async () => {
      const mockActivities = [{ id: '1', status: 'pending' }];
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: mockActivities });

      const response = await request(app)
        .get('/api/activities?status=pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE status = $1'),
        ['pending']
      );
    });
  });

  describe('PATCH /api/activities/:id/approve', () => {
    it('should allow an admin to approve an activity', async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rowCount: 1, rows: [{ id: '1', status: 'approved' }] });

      const response = await request(app)
        .patch('/api/activities/1/approve')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('approved');
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE activities SET status = 'approved'"),
        ['1']
      );
    });

    it('should return 403 for non-admins trying to approve', async () => {
      const response = await request(app)
        .patch('/api/activities/1/approve')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});
