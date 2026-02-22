import { EntityEnvConfig } from '@game-cms/base-core';
import type { PluginValueSourceContext } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';
import { createJiti } from 'jiti';

import { getReExportedSchemaPaths } from './analyzer.js';
import { validateEntitySchemaMap } from './validate.js';

export async function resolveEntityEnvConfig(
  context: PluginValueSourceContext
): Promise<EntityEnvConfig> {
  const jiti = createJiti(import.meta.url);

  const registryFilePath = context.compiledFilePath('entities/registry.ts');
  const registry = await jiti.import(registryFilePath);

  const paths = await getReExportedSchemaPaths(registryFilePath);

  validateEntitySchemaMap(registry);

  return {
    registryFilePath,
    registry: mapObject(registry, (rest, id) => ({
      ...rest,
      filePath: paths[id]?.filePath,
    })),
  };
}
