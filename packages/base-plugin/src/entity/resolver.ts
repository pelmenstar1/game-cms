import { EntityEnvConfig } from '@game-cms/base-core';
import type { PluginValueSourceContext } from '@game-cms/core';
import { createJiti } from 'jiti';

import { shallowValidateEntitySchemaMap } from './validate.js';

export async function resolveEntitySchemas(
  context: PluginValueSourceContext
): Promise<EntityEnvConfig> {
  const jiti = createJiti(import.meta.url);

  const registryFilePath = context.compiledFilePath('entities/registry.ts');
  const registry = await jiti.import(registryFilePath);

  if (!shallowValidateEntitySchemaMap(registry)) {
    throw new Error('Invalid entity registry');
  }

  return {
    registryFilePath,
    registry,
  };
}
