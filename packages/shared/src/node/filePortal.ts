import path from 'node:path';

import type { FilePortal } from '../filePortal.js';

export function filePortal(meta: ImportMeta, relativePath: string): FilePortal {
  return {
    filePath: path.join(meta.dirname, relativePath),
  };
}
