import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server/index';
import { pool } from '../server/db';
import jwt from 'jsonwebtoken';

// Create a mock client
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

describe('Members API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.query.mockReset();
    mockClient.release.mockReset();
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
      (pool.query as any).mockResolvedValue({ rows: [] });
      const notFoundToken = jwt.sign({ sub: '999', role: 'member' }, JWT_SECRET);

      const response = await request(app)
        .get('/api/members/999')
        .set('Authorization', `Bearer ${notFoundToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Member not found or unauthorized' });
    });

    it('should query with visibility constraints', async () => {
      const mockMember = { id: '1', first_name: 'Arthur' };
      (pool.query as any).mockResolvedValueOnce({ rows: [mockMember] });

      await request(app)
        .get('/api/members/1')
        .set('Authorization', `Bearer ${token}`);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("visibility = 'public' OR visibility = 'family-only' OR id = $2"),
        ['1', '1']
      );
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

      // BEGIN
      mockClient.query.mockResolvedValueOnce({});
      
      // INSERT
      mockClient.query.mockResolvedValueOnce({ rows: [mockCreatedMember] });
      
      // Sibling Reciprocal check (if siblings provided, but none here)
      // COMMIT
      mockClient.query.mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/members')
        .send(newMember);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedMember);
      
      // Verify client.query was called
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    });
  });

  describe('PUT /api/members/:id', () => {
    it('should allow unsetting death_date (setting to null)', async () => {
      const existingMember = {
        id: '1',
        first_name: 'Arthur',
        death_date: '1200-01-01',
        role: 'member',
        relationships: {},
        siblings: []
      };

      const updatePayload = {
        death_date: null
      };

      // 1. BEGIN
      mockClient.query.mockResolvedValueOnce({});
      
      // 2. SELECT FOR UPDATE
      mockClient.query.mockResolvedValueOnce({ rows: [existingMember] });
      
      // 3. UPDATE
      const updatedMember = { ...existingMember, death_date: null };
      mockClient.query.mockResolvedValueOnce({ rows: [updatedMember] });
      
      // 4. COMMIT
      mockClient.query.mockResolvedValueOnce({});

      const response = await request(app)
        .put('/api/members/1')
        .send(updatePayload)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.death_date).toBeNull();
      
      // Verify update query params
      const updateCall = mockClient.query.mock.calls.find(call => call[0].includes('UPDATE family_members SET'));
      expect(updateCall).toBeDefined();
      const params = updateCall[1];
      // Param for death_date is $6. 
      // Params index 5.
      expect(params[5]).toBeNull();
    });
  });
});