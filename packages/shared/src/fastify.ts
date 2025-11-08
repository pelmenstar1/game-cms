import fs from 'node:fs';
import fsp from 'node:fs/promises';

import type { FastifyReply } from 'fastify';

import { isFileNotFoundError } from './errors/index.js';
import type { MimeType } from './mime.js';

export async function sendFile(
  res: FastifyReply,
  filePath: string,
  type?: MimeType
) {
  try {
    const { size } = await fsp.stat(filePath);
    const stream = fs.createReadStream(filePath);

    if (type) {
      res.type(type);
    }

    return await res.header('content-length', size).send(stream);
  } catch (error: unknown) {
    if (isFileNotFoundError(error)) {
      res.callNotFound();
      return;
    }

    throw error;
  }
}
