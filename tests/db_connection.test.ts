import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Database Configuration File', () => {
  const dbPath = path.join(process.cwd(), 'server', 'db.ts');

  it('should exist', () => {
    expect(fs.existsSync(dbPath)).toBe(true);
  });

  it('should export a pool instance', async () => {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      expect(content).toContain('export const pool = new Pool');
      expect(content).toContain("import { Pool } from 'pg'");
    } else {
      expect(true).toBe(false);
    }
  });
});