import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Environment Configuration', () => {
  const envPath = path.join(process.cwd(), '.env');

  it('should have a .env file', () => {
    expect(fs.existsSync(envPath)).toBe(true);
  });

  it('should contain database configuration', () => {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      expect(content).toContain('DB_USER');
      expect(content).toContain('DB_PASSWORD');
      expect(content).toContain('DB_HOST');
      expect(content).toContain('DB_PORT');
      expect(content).toContain('DB_NAME');
    } else {
      expect(true).toBe(false);
    }
  });
});
