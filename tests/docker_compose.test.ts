import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Docker Compose Configuration', () => {
  const composePath = path.join(process.cwd(), 'docker-compose.yml');

  it('should exist', () => {
    expect(fs.existsSync(composePath)).toBe(true);
  });

  it('should define postgres and backend services', () => {
    if (fs.existsSync(composePath)) {
      const content = fs.readFileSync(composePath, 'utf-8');
      expect(content).toContain('postgres:');
      expect(content).toContain('backend:');
    } else {
      expect(true).toBe(false);
    }
  });
});
