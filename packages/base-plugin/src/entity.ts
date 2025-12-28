import type { EntitySchema } from '@game-cms/base-types';
import { importFile } from '@game-cms/shared/io';
import { scanDirectory } from '@game-cms/shared/io';
import type { ValueSourceContext } from '@game-cms/types';

async function importEntitySchema(filePath: string) {
  if (filePath.endsWith('.js')) {
    const result = await importFile<{ default: EntitySchema }>(filePath);

    return result.default;
  }
}

export async function scanEntitySchemas(
  context: ValueSourceContext
): Promise<EntitySchema[]> {
  const directoryPath = context.compiledFilePath('entities');

  return scanDirectory(directoryPath, importEntitySchema);
}
