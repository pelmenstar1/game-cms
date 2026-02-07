import type { EntityDescriptor, EntitySchema } from '@game-cms/base-core';
import type { ValueSourceContext } from '@game-cms/core';
import { scanDirectory } from '@game-cms/shared/node/io';
import { createJiti, type Jiti } from 'jiti';

async function importEntitySchema(
  filePath: string,
  jiti: Jiti
): Promise<EntityDescriptor | undefined> {
  if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
    const schema = await jiti.import<EntitySchema>(filePath, {
      default: true,
    });

    if ('id' in schema) {
      return { ...schema, filePath };
    }
  }
}

export function scanEntitySchemas(
  context: ValueSourceContext
): Promise<EntityDescriptor[]> {
  const jiti = createJiti(import.meta.url);
  const directoryPath = context.compiledFilePath('entities');

  return scanDirectory(directoryPath, (filePath) =>
    importEntitySchema(filePath, jiti)
  );
}
