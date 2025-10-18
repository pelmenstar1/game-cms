import fsp from 'node:fs/promises';
import { parseEnv } from 'node:util';

import { isFileNotFoundError } from './errors/index.js';

export async function loadEnvIfExists() {
  try {
    const content = await fsp.readFile('./.env', 'utf8');

    const env = parseEnv(content);

    Object.assign(process.env, env);
  } catch (error) {
    if (!isFileNotFoundError(error)) {
      throw error;
    }
  }
}
