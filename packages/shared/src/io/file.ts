import fsp from 'node:fs/promises';

export async function readJson<T>(filePath: string) {
  const content = await fsp.readFile(filePath, 'utf8');

  return JSON.parse(content) as T;
}
