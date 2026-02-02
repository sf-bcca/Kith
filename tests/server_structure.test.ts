import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Server Initialization', () => {
  it('should have a server directory with package.json', () => {
    const serverPath = path.join(process.cwd(), 'server');
    const packageJsonPath = path.join(serverPath, 'package.json');
    
    expect(fs.existsSync(serverPath)).toBe(true);
    expect(fs.existsSync(packageJsonPath)).toBe(true);
  });
});
