import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Server Dockerfile', () => {
  const dockerfilePath = path.join(process.cwd(), 'server', 'Dockerfile');

  it('should exist', () => {
    expect(fs.existsSync(dockerfilePath)).toBe(true);
  });

  it('should use a node base image', () => {
    if (fs.existsSync(dockerfilePath)) {
      const content = fs.readFileSync(dockerfilePath, 'utf-8');
      expect(content).toContain('FROM node');
    } else {
      expect(true).toBe(false);
    }
  });
});
