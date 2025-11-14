import path from 'node:path';

export function importFile<T = unknown>(filePath: string): Promise<T> {
  return import(
    /* @vite-ignore */
    `file://${path.resolve(filePath)}`
  );
}
