import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Server Entrypoint', () => {
  const entryPath = path.join(process.cwd(), 'server', 'index.ts');

  it('should exist', () => {
    expect(fs.existsSync(entryPath)).toBe(true);
  });

  it('should use express', () => {
    // Only try to read if it exists to avoid crashing test suite before assertion
    if (fs.existsSync(entryPath)) {
      const content = fs.readFileSync(entryPath, 'utf-8');
      expect(content).toContain('express');
    } else {
      // If it doesn't exist, we can't check content, but previous test will fail anyway.
      // But let's fail this one too explicitly.
      expect(true).toBe(false); 
    }
  });
});
