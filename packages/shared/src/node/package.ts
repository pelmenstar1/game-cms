import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function getImportDirectory(id: string) {
  return path.dirname(fileURLToPath(id));
}
