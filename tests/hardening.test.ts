import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server/index';
import { pool } from '../server/db';
import jwt from 'jsonwebtoken';
import { validateImageUrl } from '../src/utils/security';

// Mock the database pool
vi.mock('../server/db', () => ({
  pool: {
    query: vi.fn(),
  },
}));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const token = jwt.sign({ sub: '1' }, JWT_SECRET);

describe('Security: Hardening & Sanitization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Generic Error Handling', () => {
    it('should return a generic 500 error without leaking internal details', async () => {
      (pool.query as any).mockRejectedValueOnce(new Error('Sensitive SQL Error details here'));

      const response = await request(app)
        .get('/api/members')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
      expect(response.body).not.toHaveProperty('message', 'Sensitive SQL Error details here');
    });
  });

  describe('URL Sanitization (CSS Injection Prevention)', () => {
    it('should identify and block malicious URLs in photoUrl', () => {
      expect(validateImageUrl('https://example.com/photo.jpg')).toBe('https://example.com/photo.jpg');
      expect(validateImageUrl('javascript:alert(1)')).toBe('');
      expect(validateImageUrl('https://example.com/photo.jpg"); background: url("http://evil.com/log')).toBe('');
    });
  });
});
