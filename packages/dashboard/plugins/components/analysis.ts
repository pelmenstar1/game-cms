import type { ComponentCore } from '@game-cms/core';
import { importFile } from '@game-cms/shared/node';

export async function getComponentIdFromCoreFile(filePath: string) {
  const module = await importFile<{ default: ComponentCore }>(filePath);

  return module.default.id;
}
