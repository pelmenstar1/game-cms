import { randomUUID } from 'node:crypto';
import fsp from 'node:fs/promises';
import path from 'node:path';

interface TemporalDirectory extends AsyncDisposable {
  path: string;
}

export async function temporalDirectory(): Promise<TemporalDirectory> {
  const name = randomUUID();
  const dirPath = path.join('./', name);

  await fsp.mkdir(dirPath);

  return {
    path: dirPath,
    [Symbol.asyncDispose]: async () => {
      await fsp.rm(dirPath, { recursive: true });
    },
  };
}
