import type { ServerEntitySchema } from '@game-cms/base-types';
import { importFile } from '@game-cms/shared';
import { scanDirectory } from '@game-cms/shared/io';
import type { ValueSourceContext } from '@game-cms/types';

async function importEntitySchema(filePath: string) {
  const result = await importFile<{ default: ServerEntitySchema }>(filePath);

  return result.default;
}

export async function scanEntitySchemas(
  context: ValueSourceContext
): Promise<ServerEntitySchema[]> {
  const directoryPath = context.compiledFilePath('entities');

  return scanDirectory(directoryPath, importEntitySchema);
}
