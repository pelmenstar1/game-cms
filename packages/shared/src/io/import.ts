import { pathToFileURL } from 'node:url';

export function importFile<T = unknown>(filePath: string): Promise<T> {
  return import(
    /* @vite-ignore */
    pathToFileURL(filePath).href
  );
}
