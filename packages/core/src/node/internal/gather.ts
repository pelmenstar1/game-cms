import path from 'node:path';

import { ComponentRendererVariant } from '../../component/index.js';

export function getRendererVariantFromFilePath(filePath: string) {
  const name = path.basename(filePath);

  const match = name.match(/^renderer\.(.+)\.js$/);
  if (match) {
    return match[1] as ComponentRendererVariant;
  }

  return null;
}
