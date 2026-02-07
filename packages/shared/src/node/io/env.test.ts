import fsp from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadEnvFileIfExists } from './env.js';
import { temporalDirectory } from './tempDir.js';

describe('loadEnvFileIfExists', () => {
  it('should load env from file', async () => {
    await using tempDir = await temporalDirectory();

    const envContent = `TEST_VAR=test_value
TEST_NUMBER=123
TEST_BOOL=true`;

    await fsp.writeFile(path.join(tempDir.path, '.env'), envContent);

    delete process.env.TEST_VAR;
    delete process.env.TEST_NUMBER;
    delete process.env.TEST_BOOL;

    await loadEnvFileIfExists(tempDir.path);

    expect(process.env.TEST_VAR).toBe('test_value');
    expect(process.env.TEST_NUMBER).toBe('123');
    expect(process.env.TEST_BOOL).toBe('true');

    delete process.env.TEST_VAR;
    delete process.env.TEST_NUMBER;
    delete process.env.TEST_BOOL;
  });

  it('should handle non-existent file', async () => {
    await using tempDir = await temporalDirectory();

    await expect(loadEnvFileIfExists(tempDir.path)).resolves.toBeUndefined();
  });

  it('should load from custom filename', async () => {
    await using tempDir = await temporalDirectory();

    const envContent = 'CUSTOM_VAR=custom_value';

    await fsp.writeFile(path.join(tempDir.path, '.env.custom'), envContent);

    delete process.env.CUSTOM_VAR;

    await loadEnvFileIfExists(tempDir.path, '.env.custom');

    expect(process.env.CUSTOM_VAR).toBe('custom_value');

    delete process.env.CUSTOM_VAR;
  });
});
