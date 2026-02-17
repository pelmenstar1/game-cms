import path from 'node:path';

import { extension } from 'mime-types';

export function removeExtension(filePath: string) {
  const extLength = path.extname(filePath).length;
  if (extLength === 0) {
    return filePath;
  }

  return filePath.slice(0, -extLength);
}

export function inferFileExtensionFromMime(mime: string, originalName: string) {
  const ext = path.extname(originalName);

  if (ext.length === 0) {
    const mimeExtension = extension(mime);

    if (mimeExtension) {
      return `.${mimeExtension}`;
    }
  }

  return ext;
}
