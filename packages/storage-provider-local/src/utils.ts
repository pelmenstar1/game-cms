import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function createNewFileName(storagePath: string, initialName: string) {
  const extension = path.extname(initialName);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const uuid = crypto.randomUUID();
    const name = `${uuid}${extension}`;

    const filePath = path.join(storagePath, name);

    if (!fs.existsSync(filePath)) {
      return name;
    }
  }
}
