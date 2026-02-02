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

describe('Health Check API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 and ok status when DB is connected', async () => {
    (pool.query as any).mockResolvedValueOnce({ rows: [{ now: new Date() }] });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      database: 'connected',
    });
    expect(pool.query).toHaveBeenCalledWith('SELECT NOW()');
  });

  it('should return 500 and error status when DB is disconnected', async () => {
    (pool.query as any).mockRejectedValueOnce(new Error('DB Connection Error'));

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      database: 'disconnected',
      message: 'DB Connection Error',
    });
  });
});
