import path from 'node:path';

export function removeExtension(filePath: string) {
  const extLength = path.extname(filePath).length;
  if (extLength === 0) {
    return filePath;
  }

  return filePath.slice(0, -extLength);
}
