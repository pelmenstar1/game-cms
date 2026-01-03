import type { ComponentMeta } from '@game-cms/core';
import { importFile } from '@game-cms/shared/io';

export async function getComponentIdFromMetaFile(filePath: string) {
  const module = await importFile<{ default: ComponentMeta }>(filePath);

  return module.default.id;
}
