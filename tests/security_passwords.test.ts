import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../server/index';
import { pool } from '../server/db';

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

// Mock the database pool
vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn(() => mockClient),
  },
}));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const token = jwt.sign({ sub: '1', role: 'member' }, JWT_SECRET);

describe('Security: Password Privacy & Hashing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.query.mockReset();
    mockClient.release.mockReset();
  });

  describe('Password Exposure Prevention', () => {
    it('GET /api/members should not include password field', async () => {
      const mockMembers = [
        { id: '1', first_name: 'Arthur', last_name: 'Pendragon', password: 'secretpassword' },
      ];
      (pool.query as any).mockResolvedValueOnce({ rows: mockMembers });

      const response = await request(app)
        .get('/api/members')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).not.toHaveProperty('password');
    });

    it('GET /api/members/:id should not include password field', async () => {
      const mockMember = { id: '1', first_name: 'Arthur', last_name: 'Pendragon', password: 'secretpassword' };
      (pool.query as any).mockResolvedValueOnce({ rows: [mockMember] });

      const response = await request(app)
        .get('/api/members/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('password');
    });

    it('POST /api/members should return member without password field', async () => {
      const mockMember = { id: '1', first_name: 'Arthur', last_name: 'Pendragon', password: 'hashedpassword' };
      
      // Transaction
      mockClient.query.mockResolvedValueOnce({}); // BEGIN
      mockClient.query.mockResolvedValueOnce({ rows: [mockMember] }); // INSERT
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // Siblings loop check (none)
      mockClient.query.mockResolvedValueOnce({}); // COMMIT

      const response = await request(app).post('/api/members').send({
        first_name: 'Arthur',
        last_name: 'Pendragon',
        password: 'plainpassword'
      });

      expect(response.status).toBe(201);
      expect(response.body).not.toHaveProperty('password');
    });

    it('PUT /api/members/:id should return member without password field', async () => {
      const mockMember = { id: '1', first_name: 'Arthur', last_name: 'Pendragon', password: 'hashedpassword' };
      
      // Transaction
      mockClient.query.mockResolvedValueOnce({}); // BEGIN
      mockClient.query.mockResolvedValueOnce({ rows: [mockMember] }); // SELECT FOR UPDATE
      mockClient.query.mockResolvedValueOnce({ rows: [mockMember] }); // UPDATE
      mockClient.query.mockResolvedValueOnce({}); // COMMIT

      const response = await request(app)
        .put('/api/members/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          first_name: 'Arthur',
          last_name: 'Pendragon',
          password: 'newpassword'
        });

      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('Password Hashing', () => {
    it('POST /api/members should hash password before saving', async () => {
      const plainPassword = 'plainpassword';
      
      // Transaction
      mockClient.query.mockResolvedValueOnce({}); // BEGIN
      mockClient.query.mockResolvedValueOnce({ rows: [{ id: '1' }] }); // INSERT
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // Siblings loop check
      mockClient.query.mockResolvedValueOnce({}); // COMMIT

      await request(app).post('/api/members').send({
        first_name: 'Arthur',
        last_name: 'Pendragon',
        password: plainPassword
      });

      // Verify hash comparison (INSERT is the 2nd call to client.query)
      const queryArgs = mockClient.query.mock.calls[1][1];
      const passwordArg = queryArgs[12]; // 13th parameter in the INSERT query
      expect(passwordArg).not.toBe(plainPassword);
      expect(bcrypt.compareSync(plainPassword, passwordArg)).toBe(true);
    });

    it('PUT /api/settings/:id should hash new_password before saving', async () => {
      const currentPassword = 'currentpassword';
      const hashedCurrentPassword = bcrypt.hashSync(currentPassword, 10);
      const newPassword = 'newpassword';
      
      // Settings endpoint likely uses pool.query directly (not refactored yet)
      
      // Mock existing user check (getSettings)
      (pool.query as any).mockResolvedValueOnce({ rows: [{ password: hashedCurrentPassword }] });
      // Mock update
      (pool.query as any).mockResolvedValueOnce({ rows: [] }); // For password update
      (pool.query as any).mockResolvedValueOnce({ rows: [{ id: '1' }] }); // For general settings update

      const response = await request(app)
        .put('/api/settings/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          current_password: currentPassword,
          new_password: newPassword
        });

      expect(response.status).toBe(200);

      // Find the call that updates the password on pool.query
      const passwordUpdateCall = (pool.query as any).mock.calls.find((call: any) => 
        call[0].includes('UPDATE family_members SET password = $1')
      );
      
      expect(passwordUpdateCall).toBeDefined();
      const passwordArg = passwordUpdateCall[1][0];
      expect(passwordArg).not.toBe(newPassword);
      expect(bcrypt.compareSync(newPassword, passwordArg)).toBe(true);
    });
  });
});