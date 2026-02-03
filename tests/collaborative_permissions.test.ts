import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../server/index';
import { pool } from '../server/db';
import jwt from 'jsonwebtoken';

vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn().mockResolvedValue({
      rows: [],
      command: '',
      rowCount: 0,
      oid: 0,
      fields: []
    }),
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
    
    adminToken = jwt.sign({ sub: adminId, role: 'admin' }, JWT_SECRET);
    userToken = jwt.sign({ sub: userId, role: 'member' }, JWT_SECRET);
  });

  describe('PUT /api/members/:id', () => {
    it('should allow an admin to edit any member', async () => {
      vi.mocked(pool.query).mockImplementation(async () => ({ 
        rows: [{ id: targetId, first_name: 'Updated By Admin' }],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      }));

      const response = await request(app)
        .put(`/api/members/${targetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ first_name: 'Updated By Admin' });

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe('Updated By Admin');
    });

    it('should allow a regular member to edit another member (collaborative)', async () => {
      vi.mocked(pool.query).mockImplementation(async () => ({ 
        rows: [{ id: targetId, first_name: 'Updated By Member' }],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      }));

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
      vi.mocked(pool.query).mockImplementation(async () => ({ 
        rows: [{ id: targetId, first_name: 'Target' }],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      }));

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
      vi.mocked(pool.query).mockImplementation(async () => ({ 
        rows: [{ id: userId, first_name: 'Regular' }],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      }));

      const response = await request(app)
        .delete(`/api/members/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
    });
  });
});
