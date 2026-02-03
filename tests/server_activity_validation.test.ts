import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { pool } from '../server/db';

// Mock DB
vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn(),
  },
}));

// Mock Auth Middleware
vi.mock('../server/middleware/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id', role: 'member' };
    next();
  },
  authorizeOwner: (req: any, res: any, next: any) => next(),
  authorizeAdminOrOwner: (req: any, res: any, next: any) => next(),
  authorizeAdmin: (req: any, res: any, next: any) => next(),
}));

// Import app AFTER mocks
import app from '../server/index';

describe('Activity Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/activities', () => {
    it('should return 400 for invalid activity type', async () => {
      const response = await request(app)
        .post('/api/activities')
        .send({
          type: 'INVALID_TYPE',
          content: { text: 'test' }
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid activity type' });
    });

    it('should accept valid activity types', async () => {
      (pool.query as any).mockResolvedValueOnce({ rows: [{ id: '1', type: 'photo_added' }] });

      const response = await request(app)
        .post('/api/activities')
        .send({
          type: 'photo_added',
          content: { text: 'test' }
        });

      expect(response.status).toBe(201);
    });
  });

  describe('POST /api/activities/:id/comments', () => {
    it('should generate id and timestamp server-side', async () => {
       // Mock activity check
       (pool.query as any).mockResolvedValueOnce({ rows: [{ id: 'a1', comments: [] }] });
       // Mock update
       (pool.query as any).mockResolvedValueOnce({ rows: [{ id: 'a1', comments: [{}] }] });

       const payload = { authorId: 'u1', text: 'comment' };
       await request(app).post('/api/activities/a1/comments').send(payload);

       expect(pool.query).toHaveBeenCalledTimes(2);
       // Get the second call (UPDATE)
       const updateCall = (pool.query as any).mock.calls[1];
       const updateQuery = updateCall[0];
       const updateParams = updateCall[1];

       expect(updateQuery).toContain('UPDATE activities');
       const commentJson = JSON.parse(updateParams[0]);

       expect(commentJson.id).toBeDefined();
       expect(commentJson.timestamp).toBeDefined();
       expect(commentJson.authorId).toBe(payload.authorId);
       expect(commentJson.text).toBe(payload.text);
    });
  });
});
