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
const token = jwt.sign({ sub: '1' }, JWT_SECRET);

describe('Members API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/members', () => {
    it('should return a list of family members', async () => {
      const mockMembers = [
        { id: '1', first_name: 'Arthur', last_name: 'Pendragon' },
        { id: '2', first_name: 'Guinevere', last_name: 'Pendragon' },
      ];
      (pool.query as any).mockResolvedValueOnce({ rows: mockMembers });

      const response = await request(app)
        .get('/api/members')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMembers);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('id, first_name, last_name'), ['1']);
    });

    it('should return 500 if database query fails', async () => {
      (pool.query as any).mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .get('/api/members')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/members/:id', () => {
    it('should return a single family member by ID', async () => {
      const mockMember = { id: '1', first_name: 'Arthur', last_name: 'Pendragon' };
      (pool.query as any).mockResolvedValueOnce({ rows: [mockMember] });

      const response = await request(app)
        .get('/api/members/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMember);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('id, first_name, last_name'), ['1', '1']);
    });

    it('should return 404 if member not found', async () => {
      (pool.query as any).mockResolvedValueOnce({ rows: [] });
      const notFoundToken = jwt.sign({ sub: '999' }, JWT_SECRET);

      const response = await request(app)
        .get('/api/members/999')
        .set('Authorization', `Bearer ${notFoundToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Member not found or unauthorized' });
    });
  });

  describe('POST /api/members', () => {
    it('should create a new member with death details', async () => {
      const newMember = {
        first_name: 'Uther',
        last_name: 'Pendragon',
        birth_date: '1000-01-01',
        death_date: '1050-01-01',
        death_place: 'Camelot',
        gender: 'male'
      };
      
      const mockCreatedMember = { ...newMember, id: '3' };
      // Mock the INSERT query result
      (pool.query as any).mockResolvedValueOnce({ rows: [mockCreatedMember] });

      const response = await request(app)
        .post('/api/members')
        .send(newMember);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedMember);
      
      // Verify pool.query was called with correct arguments
      const queryCall = (pool.query as any).mock.calls[0];
      const sql = queryCall[0];
      const params = queryCall[1];
      
      expect(sql).toContain('death_place');
      expect(params).toContain('Camelot');
      expect(params).toContain('1050-01-01');
    });
  });
});
