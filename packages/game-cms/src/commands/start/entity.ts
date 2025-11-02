import path from 'node:path';

import type { ServerEntitySchema } from '@game-cms/types';

import { compiledDirectoryPath } from '../../utils/localPath.js';
import { scanDirectory } from './scan.js';

async function importEntitySchema(filePath: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const result: { default: ServerEntitySchema } = await import(
    `file://${path.resolve(filePath)}`
  );

  return result.default;
}

export async function scanEntitySchemas(): Promise<ServerEntitySchema[]> {
  const directoryPath = compiledDirectoryPath('entities');

  return scanDirectory(directoryPath, (filePath) =>
    importEntitySchema(filePath)
  );
}
