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

describe('Member Creation Duplicates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 409 Conflict when creating a duplicate member', async () => {
    // Simulate a Unique Constraint Violation (Postgres code 23505)
    const dbError: any = new Error('duplicate key value violates unique constraint');
    dbError.code = '23505';
    (pool.query as any).mockRejectedValueOnce(dbError);

    const newMember = {
      first_name: 'Lancelot',
      last_name: 'Du Lac',
      birth_date: '0490-01-01',
      gender: 'Male',
      email: 'lancelot@camelot.uk'
    };

    const response = await request(app)
      .post('/api/members')
      .send(newMember);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'A member with these details already exists.' });
  });
});
