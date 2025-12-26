import { importFile } from '@game-cms/shared/io';
import type { ComponentMeta } from '@game-cms/types';

export async function getComponentIdFromMetaFile(filePath: string) {
  const module = await importFile<{ default: ComponentMeta }>(filePath);

  return module.default.id;
}
