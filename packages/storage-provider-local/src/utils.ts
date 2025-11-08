import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function resolveNewFilePath(storagePath: string) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const name = crypto.randomUUID();

    const filePath = path.join(storagePath, name);

    if (!fs.existsSync(filePath)) {
      return filePath;
    }
  }
}
