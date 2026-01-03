import type { ComponentMeta } from '@game-cms/core';
import { importFile } from '@game-cms/shared/io';

export async function getComponentIdFromSharedFile(filePath: string) {
  const module = await importFile<{ meta: ComponentMeta }>(filePath);

  return module.meta.id;
}
