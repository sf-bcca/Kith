import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
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

describe('Member Creation Duplicates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.query.mockReset();
    mockClient.release.mockReset();
  });

  it('should return 409 Conflict when creating a duplicate member', async () => {
    const newMember = {
      first_name: 'Lancelot',
      last_name: 'Du Lac',
      birth_date: '0490-01-01',
      gender: 'Male',
      email: 'lancelot@camelot.uk'
    };

    // BEGIN
    mockClient.query.mockResolvedValueOnce({});

    // INSERT -> Throw Error
    const dbError: any = new Error('duplicate key value violates unique constraint');
    dbError.code = '23505';
    mockClient.query.mockRejectedValueOnce(dbError);

    // ROLLBACK
    mockClient.query.mockResolvedValueOnce({});

    const response = await request(app)
      .post('/api/members')
      .send(newMember);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'A member with these details already exists.' });
    
    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
  });
});