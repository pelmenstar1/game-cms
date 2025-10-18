import path from 'node:path';

export function removeExtension(filePath: string) {
  return filePath.slice(0, -path.extname(filePath).length);
}
