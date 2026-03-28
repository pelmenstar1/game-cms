import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function getFrontendDistributionPath() {
  const moduleRoot = import.meta
    .resolve('@demo-platformer/frontend/package.json');

  return path.join(path.dirname(fileURLToPath(moduleRoot)), './dist');
}
