import fsp from 'node:fs/promises';
import path from 'node:path';

import { isEntityExistsError } from '@game-cms/shared/errors';
import { glob } from 'glob';

const srcDir = path.join(import.meta.dirname, '../src');

async function findFiles(): Promise<string[]> {
  return glob(path.join(srcDir, '**/*.scss').replaceAll('\\', '/'));
}

async function copyStyles(files: string[]) {
  await Promise.all(
    files.map(async (filePath) => {
      const distPath = path.join('./dist/src', path.relative(srcDir, filePath));

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

async function main() {
  const files = await findFiles();

  await copyStyles(files);
}

void main();
