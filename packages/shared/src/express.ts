import type { Response } from 'express';
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';

export async function writeFileToResponse(
  filePath: string,
  mimeType: string,
  res: Response
) {
  const { size } = await fsp.stat(filePath);

  res
    .status(200)
    .header('Content-Type', mimeType)
    .header('Content-Length', size.toString());

  await pipeline(fs.createReadStream(filePath), res);
}
