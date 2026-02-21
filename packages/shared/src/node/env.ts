import fsp from 'node:fs/promises';
import path from 'node:path';
// eslint-disable-next-line unicorn/import-style
import util from 'node:util';

import { isFileNotFoundError } from './error.js';

export async function loadEnvFileIfExists(
  baseDir: string = './',
  fileName: string = '.env'
) {
  try {
    const content = await fsp.readFile(path.join(baseDir, fileName), 'utf8');

    const env = util.parseEnv(content);

    Object.assign(process.env, env);
  } catch (error) {
    if (!isFileNotFoundError(error)) {
      throw error;
    }
  }
}
