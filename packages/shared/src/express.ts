import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

import type { Response } from 'express';

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
