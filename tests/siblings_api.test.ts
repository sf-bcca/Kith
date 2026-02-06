import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server/index';
import { pool } from '../server/db';

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

describe('Siblings API', () => {
  const mockUser = { id: 'user-1', role: 'member' };
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock client implementations
    mockClient.query.mockReset();
    mockClient.release.mockReset();
    
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
      
      // GET uses pool.query directly
      (pool.query as any).mockResolvedValueOnce({
        rows: [{ id: memberId, siblings: [{ id: 's1', type: 'Full' }], relationships: { parents } }]
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
        siblings: [{ id: 's1', type: 'Full' }]
      };

      // Transaction steps:
      // 1. BEGIN
      mockClient.query.mockResolvedValueOnce({});
      
      // 2. INSERT member
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 'new-id', ...newMemberData }]
      });

      // 3. Reciprocal updates for siblings loop
      // "SELECT siblings ... FOR UPDATE" for s1
      mockClient.query.mockResolvedValueOnce({
        rows: [{ siblings: [] }] // s1 has no siblings yet
      });
      
      // 4. UPDATE s1
      mockClient.query.mockResolvedValueOnce({});

      // 5. COMMIT
      mockClient.query.mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/members')
        .send(newMemberData);

      expect(response.status).toBe(201);
      
      // Verify transaction commit
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
      
      // Verify sibling reciprocal update
      expect(mockClient.query).toHaveBeenCalledWith(
        'UPDATE family_members SET siblings = $1 WHERE id = $2',
        [JSON.stringify([{ id: 'new-id', type: 'Full' }]), 's1']
      );
    });
  });

  describe('PUT /api/members/:id', () => {
    it('should handle bidirectional sibling updates', async () => {
      const memberId = 'm1';
      const updateData = {
        siblings: [{ id: 's1', type: 'Full' }, { id: 's2', type: 'Half' }] 
        // s1 exists, s2 is new
      };

      // 1. BEGIN
      mockClient.query.mockResolvedValueOnce({});

      // 2. SELECT ... FOR UPDATE (Fetch Current Member)
      mockClient.query.mockResolvedValueOnce({
        rows: [{ 
          id: memberId,
          siblings: [{ id: 's1', type: 'Full' }],
          password: 'hash'
        }]
      });

      // Logic: 
      // Current: s1
      // Incoming: s1, s2
      // Added: s2
      // Removed: none

      // 3. Reciprocal Added: s2 -> SELECT FOR UPDATE
      mockClient.query.mockResolvedValueOnce({
        rows: [{ siblings: [] }] // s2 has no siblings
      });

      // 4. UPDATE s2 to add m1
      mockClient.query.mockResolvedValueOnce({});

      // 5. UPDATE m1 (Main Update)
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: memberId, ...updateData }]
      });

      // 6. COMMIT
      mockClient.query.mockResolvedValueOnce({});

      const response = await request(app)
        .put(`/api/members/${memberId}`)
        .send(updateData);

      expect(response.status).toBe(200);

      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');

      // Should update added sibling (s2) to include m1
      expect(mockClient.query).toHaveBeenCalledWith(
        'UPDATE family_members SET siblings = $1 WHERE id = $2',
        [JSON.stringify([{ id: memberId, type: 'Half' }]), 's2']
      );
    });
  });
});