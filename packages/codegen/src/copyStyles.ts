import fsp from 'node:fs/promises';
import path from 'node:path';

import { isEntityExistsError } from '@game-cms/shared/errors';
import { glob } from 'glob';

async function findFiles(baseDir: string): Promise<string[]> {
  return glob(path.join(baseDir, '**/*.scss').replaceAll('\\', '/'));
}

async function linkStyles(
  baseDir: string,
  distSuffix: string,
  files: string[]
) {
  await Promise.all(
    files.map(async (filePath) => {
      const distPath = path.join(
        './dist',
        distSuffix,
        path.relative(baseDir, filePath)
      );

      await fsp.mkdir(path.dirname(distPath), { recursive: true });

      try {
        await fsp.link(filePath, distPath);
      } catch (error) {
        if (!isEntityExistsError(error)) {
          throw error;
        }
      }
    })
  );
}

export async function copyStyles(baseDir: string, distSuffix: string = '') {
  const files = await findFiles(baseDir);

  await linkStyles(baseDir, distSuffix, files);
}
