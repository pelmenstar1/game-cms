import { importFile } from '@game-cms/shared/io';

export async function parseComponentMetaFile(filePath: string) {
  const module = await importFile<{ id: string; defaultData: unknown }>(
    filePath
  );

  return { componentId: module.id, defaultData: module.defaultData };
}
