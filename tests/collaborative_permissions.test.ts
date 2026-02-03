import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../server/index';
import { pool } from '../server/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

describe('Admin and Collaborative Permissions', () => {
  let adminToken: string;
  let userToken: string;
  let adminId: string;
  let userId: string;
  let targetId: string;

  beforeEach(async () => {
    // Clean up and setup test data
    await pool.query('DELETE FROM family_members');
    
    // Create Admin
    const adminRes = await pool.query(
      "INSERT INTO family_members (first_name, last_name, birth_date, gender, role) VALUES ('Admin', 'User', '1980-01-01', 'other', 'admin') RETURNING id"
    );
    adminId = adminRes.rows[0].id;
    adminToken = jwt.sign({ sub: adminId, role: 'admin' }, JWT_SECRET);

    // Create Regular User
    const userRes = await pool.query(
      "INSERT INTO family_members (first_name, last_name, birth_date, gender, role) VALUES ('Regular', 'User', '1990-01-01', 'other', 'member') RETURNING id"
    );
    userId = userRes.rows[0].id;
    userToken = jwt.sign({ sub: userId, role: 'member' }, JWT_SECRET);

    // Create a target member to edit/delete
    const targetRes = await pool.query(
      "INSERT INTO family_members (first_name, last_name, birth_date, gender, role) VALUES ('Target', 'Member', '2000-01-01', 'other', 'member') RETURNING id"
    );
    targetId = targetRes.rows[0].id;
  });

  describe('PUT /api/members/:id', () => {
    it('should allow an admin to edit any member', async () => {
      const response = await request(app)
        .put(`/api/members/${targetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ first_name: 'Updated By Admin' });

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe('Updated By Admin');
    });

    it('should allow a regular member to edit another member (collaborative)', async () => {
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
      const response = await request(app)
        .delete(`/api/members/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
    });
  });
});
