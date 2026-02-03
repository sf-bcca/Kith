import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
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
      const newComment = { author: 'User', text: 'Nice!' };
      
      (pool.query as any)
        .mockResolvedValueOnce({ rows: [mockActivity] }) // Check if activity exists
        .mockResolvedValueOnce({ rows: [{ ...mockActivity, comments: [newComment] }] }); // Update activity

      const response = await request(app)
        .post('/api/activities/a1/comments')
        .send(newComment);

      expect(response.status).toBe(201);
      expect(response.body.comments).toContainEqual(newComment);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE activities SET comments = comments || $1::jsonb WHERE id = $2 RETURNING *',
        [JSON.stringify(newComment), 'a1']
      );
    });

    it('should return 404 if activity not found', async () => {
      (pool.query as any).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/activities/999/comments')
        .send({ author: 'User', text: 'Hi' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Activity not found' });
    });
  });
});
