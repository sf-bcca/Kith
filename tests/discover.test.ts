import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server/index';
import { pool } from '../server/db';
import jwt from 'jsonwebtoken';

vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn(),
  },
}));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const token = jwt.sign({ sub: '1', role: 'member' }, JWT_SECRET);

describe('Discover API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/discover/summary', () => {
    it('should return discovery summary with on-this-day events and hints', async () => {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      const mockOnThisDay = [
        { id: '1', first_name: 'Arthur', last_name: 'Pendragon', birth_date: `${today.getFullYear() - 50}-${month}-${day}` },
      ];
      const mockHintsMembers = [
        { id: '2', first_name: 'Guinevere', last_name: 'Pendragon', profile_image: null, bio: '' },
      ];

      (pool.query as any).mockResolvedValueOnce({ rows: mockOnThisDay });
      (pool.query as any).mockResolvedValueOnce({ rows: mockHintsMembers });

      const response = await request(app)
        .get('/api/discover/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('onThisDay');
      expect(response.body).toHaveProperty('hints');
      
      expect(response.body.onThisDay).toHaveLength(1);
      expect(response.body.onThisDay[0].first_name).toBe('Arthur');
      
      expect(response.body.hints).toContainEqual(expect.objectContaining({
        type: 'missing_info',
        memberId: '2'
      }));
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/api/discover/summary');
      expect(response.status).toBe(401);
    });
  });
});
