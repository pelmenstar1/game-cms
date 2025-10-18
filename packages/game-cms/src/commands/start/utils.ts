import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function getPackageBuildDirectory(id: string) {
  return path.dirname(fileURLToPath(import.meta.resolve(id)));
}
