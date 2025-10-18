import fsp from 'node:fs/promises';
import path from 'node:path';

import { isEntityExistsError } from '@game-cms/shared/errors';

const srcDir = path.join(import.meta.dirname, '../src');

async function findFiles(): Promise<string[]> {
  async function worker(dirName: string): Promise<string[]> {
    const entries = await fsp.readdir(dirName, { withFileTypes: true });

    const result = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(dirName, entry.name);

        if (entry.isDirectory()) {
          return worker(entryPath);
        } else if (entry.isFile() && entry.name.endsWith('.scss')) {
          return entryPath;
        } else {
          return [];
        }
      })
    );

    return result.flat();
  }

  return worker(srcDir);
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
