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

describe('Siblings API', () => {
  const mockUser = { id: 'user-1', role: 'member' };
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock authentication middleware user
    vi.mock('../server/middleware/auth', () => ({
      authenticate: (req: any, res: any, next: any) => {
        req.user = { id: 'user-1', role: 'member' };
        next();
      },
      authorizeAdmin: vi.fn(),
      authorizeOwner: vi.fn(),
      authorizeAdminOrOwner: vi.fn(),
    }));
  });

  describe('GET /api/members/:id/siblings', () => {
    it('should return explicit and implied siblings', async () => {
      const memberId = 'm1';
      const parents = ['p1', 'p2'];
      
      // 1. Initial query for member's parents and explicit siblings
      (pool.query as any).mockResolvedValueOnce({
        rows: [{ id: memberId, siblings: ['s1'], relationships: { parents } }]
      });
      
      // 2. Query for implied siblings (members with same parents)
      (pool.query as any).mockResolvedValueOnce({
        rows: [{ id: 's2' }] // Implied sibling
      });
      
      // 3. Query for full sibling records
      const mockSiblings = [
        { id: 's1', first_name: 'Explicit', last_name: 'Sibling' },
        { id: 's2', first_name: 'Implied', last_name: 'Sibling' }
      ];
      (pool.query as any).mockResolvedValueOnce({ rows: mockSiblings });

      const response = await request(app).get(`/api/members/${memberId}/siblings`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.map((s: any) => s.id)).toContain('s1');
      expect(response.body.map((s: any) => s.id)).toContain('s2');
    });
  });

  describe('POST /api/members', () => {
    it('should handle siblings during member creation', async () => {
      const newMemberData = {
        first_name: 'New',
        last_name: 'Member',
        gender: 'male',
        siblings: ['s1']
      };

      (pool.query as any).mockResolvedValueOnce({
        rows: [{ id: 'new-id', ...newMemberData }]
      });

      const response = await request(app)
        .post('/api/members')
        .send(newMemberData);

      expect(response.status).toBe(201);
      
      // Verify reciprocal update query was called (twice: one for linking new->sibling (implicit in INSERT/UPDATE?), one for sibling->new)
      // Actually my code does two UPDATEs per sibling loop.
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE\s+family_members\s+SET\s+siblings/i),
        expect.any(Array)
      );
    });
  });

  describe('PUT /api/members/:id', () => {
    it('should handle bidirectional sibling updates', async () => {
      const memberId = 'm1';
      const updateData = {
        siblings: ['s1', 's2'] // Adding s2 (s1 assumed existing)
      };

      // Mock getting current siblings
      (pool.query as any).mockResolvedValueOnce({
        rows: [{ siblings: ['s1'] }]
      });

      // Mock update for added sibling 's2'
      (pool.query as any).mockResolvedValueOnce({});

      // Mock main update
      (pool.query as any).mockResolvedValueOnce({
        rows: [{ id: memberId, ...updateData }]
      });

      const response = await request(app)
        .put(`/api/members/${memberId}`)
        .send(updateData);

      expect(response.status).toBe(200);

      // Should fetch current siblings
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT siblings FROM family_members WHERE id = $1',
        [memberId]
      );

      // Should update added sibling (s2) to include m1
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE\s+family_members\s+SET\s+siblings.*jsonb\s+\|\|\s+\$1::jsonb/),
        [JSON.stringify([memberId]), 's2']
      );
    });
  });
});
