import fsp from 'node:fs/promises';

import json5 from 'json5';

export async function readJson<T>(filePath: string) {
  const content = await fsp.readFile(filePath, 'utf8');

  return JSON.parse(content) as T;
}

export async function readJson5<T>(filePath: string): Promise<T> {
  const content = await fsp.readFile(filePath, 'utf8');

  return json5.parse(content);
}
