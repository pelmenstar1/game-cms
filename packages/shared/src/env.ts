import fsp from 'node:fs/promises';
// eslint-disable-next-line unicorn/import-style
import util from 'node:util';

import { isFileNotFoundError } from './errors/index.js';

export async function loadEnvFileIfExists() {
  try {
    const content = await fsp.readFile('./.env', 'utf8');

    const env = util.parseEnv(content);

    Object.assign(process.env, env);
  } catch (error) {
    if (!isFileNotFoundError(error)) {
      throw error;
    }
  }
}
