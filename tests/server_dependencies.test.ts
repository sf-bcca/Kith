import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Server Dependencies', () => {
  const packageJsonPath = path.join(process.cwd(), 'server', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  it('should have runtime dependencies', () => {
    const deps = packageJson.dependencies || {};
    expect(deps).toHaveProperty('express');
    expect(deps).toHaveProperty('pg');
    expect(deps).toHaveProperty('dotenv');
  });

  it('should have dev dependencies', () => {
    const devDeps = packageJson.devDependencies || {};
    expect(devDeps).toHaveProperty('typescript');
    expect(devDeps).toHaveProperty('@types/node');
    expect(devDeps).toHaveProperty('@types/express');
    expect(devDeps).toHaveProperty('@types/pg');
    expect(devDeps).toHaveProperty('ts-node-dev');
  });
});
