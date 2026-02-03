import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import app from '../server/index';
import { pool } from '../server/db';

// Mock the database pool
vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn(),
  },
}));

describe('Activities API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/activities', () => {
    it('should return a list of activities', async () => {
      const mockActivities = [
        { id: 'a1', type: 'photo_added', content: 'Fun day' },
        { id: 'a2', type: 'member_updated', content: 'Updated bio' },
      ];
      (pool.query as any).mockResolvedValueOnce({ rows: mockActivities });

      const response = await request(app).get('/api/activities');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockActivities);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM activities ORDER BY timestamp DESC', []);
    });
  });

  describe('POST /api/activities/:id/comments', () => {
    it('should add a comment to an activity', async () => {
      const mockActivity = { id: 'a1', comments: [] };
      const newComment = { authorId: 'u1', text: 'Nice!' };
      
      // Mock crypto.randomUUID
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('uuid-123' as any);

      (pool.query as any)
        .mockResolvedValueOnce({ rows: [mockActivity] }) // Check if activity exists
        .mockResolvedValueOnce({ rows: [{ ...mockActivity, comments: [{ ...newComment, id: 'uuid-123', timestamp: expect.any(String) }] }] }); // Update activity

      const response = await request(app)
        .post('/api/activities/a1/comments')
        .send(newComment);

      expect(response.status).toBe(201);
      expect(response.body.comments[0]).toMatchObject(newComment);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE activities SET comments = comments || $1::jsonb WHERE id = $2 RETURNING *',
        [expect.any(String), 'a1']
      );
    });

    it('should return 404 if activity not found', async () => {
      (pool.query as any).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/activities/999/comments')
        .send({ authorId: 'u1', text: 'Hi' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Activity not found' });
    });
  });
});
