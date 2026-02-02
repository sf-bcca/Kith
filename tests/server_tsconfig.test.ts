import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Server TypeScript Config', () => {
  const tsconfigPath = path.join(process.cwd(), 'server', 'tsconfig.json');

  it('should have a tsconfig.json file', () => {
    expect(fs.existsSync(tsconfigPath)).toBe(true);
  });
});
