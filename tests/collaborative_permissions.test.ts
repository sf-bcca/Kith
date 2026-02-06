import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../server/index';
import { pool } from '../server/db';
import jwt from 'jsonwebtoken';

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn(() => mockClient),
  },
}));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

describe('Admin and Collaborative Permissions', () => {
  let adminToken: string;
  let userToken: string;
  let adminId: string = 'admin-id';
  let userId: string = 'user-id';
  let targetId: string = 'target-id';

  beforeEach(async () => {
    vi.clearAllMocks();
    mockClient.query.mockReset();
    mockClient.release.mockReset();
    
    adminToken = jwt.sign({ sub: adminId, role: 'admin' }, JWT_SECRET);
    userToken = jwt.sign({ sub: userId, role: 'member' }, JWT_SECRET);
  });

  describe('PUT /api/members/:id', () => {
    it('should allow an admin to edit any member', async () => {
      // Transaction sequence: BEGIN, SELECT (lock), UPDATE, COMMIT
      mockClient.query.mockResolvedValueOnce({}); // BEGIN
      mockClient.query.mockResolvedValueOnce({ rows: [{ id: targetId, first_name: 'Original', role: 'member', relationships: {}, siblings: [] }] }); // SELECT
      mockClient.query.mockResolvedValueOnce({ rows: [{ id: targetId, first_name: 'Updated By Admin' }] }); // UPDATE
      mockClient.query.mockResolvedValueOnce({}); // COMMIT

      const response = await request(app)
        .put(`/api/members/${targetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ first_name: 'Updated By Admin' });

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe('Updated By Admin');
    });

    it('should allow a regular member to edit another member (collaborative)', async () => {
      mockClient.query.mockResolvedValueOnce({}); // BEGIN
      mockClient.query.mockResolvedValueOnce({ rows: [{ id: targetId, first_name: 'Original', role: 'member', relationships: {}, siblings: [] }] }); // SELECT
      mockClient.query.mockResolvedValueOnce({ rows: [{ id: targetId, first_name: 'Updated By Member' }] }); // UPDATE
      mockClient.query.mockResolvedValueOnce({}); // COMMIT

      const response = await request(app)
        .put(`/api/members/${targetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ first_name: 'Updated By Member' });

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe('Updated By Member');
    });
  });

  describe('DELETE /api/members/:id', () => {
    it('should allow an admin to delete a member', async () => {
      // DELETE uses pool.query
      vi.mocked(pool.query).mockResolvedValueOnce({ 
        rows: [{ id: targetId, first_name: 'Target' }],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      });

      const response = await request(app)
        .delete(`/api/members/${targetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('should NOT allow a regular member to delete another member', async () => {
      const response = await request(app)
        .delete(`/api/members/${targetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('should allow a member to delete their own account', async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ 
        rows: [{ id: userId, first_name: 'Regular' }],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      });

      const response = await request(app)
        .delete(`/api/members/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
    });
  });
});