import { EntityEnvConfig } from '@game-cms/base-core';
import type {
  ComponentBackContextMap,
  PluginValueSourceContext,
} from '@game-cms/core';
import { maybeJitiImport, MODULE_NOT_FOUND_MARK } from '@game-cms/shared/node';
import { mapObject } from '@game-cms/shared/object';
import { createJiti, Jiti } from 'jiti';

import { getReExportedSchemaPaths } from './analyzer.js';
import { validateEntitySchemaMap } from './validate.js';

const SCHEMA_REGISTRY_PATH = 'entities/registry.ts';
const BACK_CONTEXT_REGISTRY_PATH = 'entities/registry.backContext.ts';

async function resolveBackContextRegistry(jiti: Jiti) {
  const moduleValue = await maybeJitiImport<ComponentBackContextMap>(
    jiti,
    BACK_CONTEXT_REGISTRY_PATH
  );

  if (moduleValue !== MODULE_NOT_FOUND_MARK) {
    return moduleValue;
  }

  return {};
}

export async function resolveEntityEnvConfig(
  context: PluginValueSourceContext
): Promise<EntityEnvConfig> {
  const jiti = createJiti(import.meta.url);

  const schemaRegistryFilePath = context.compiledFilePath(SCHEMA_REGISTRY_PATH);
  const schemaRegistry = await jiti.import(schemaRegistryFilePath);
  const schemaPaths = await getReExportedSchemaPaths(schemaRegistryFilePath);

  const backContextRegistry = await resolveBackContextRegistry(jiti);

  validateEntitySchemaMap(schemaRegistry);

  return {
    registryFilePath: schemaRegistryFilePath,
    registry: mapObject(schemaRegistry, (schema, id) => ({
      schema: {
        value: schema,
        filePath: schemaPaths[id]?.filePath,
      },
      backContext: backContextRegistry[id] ?? {},
    })),
  };
}
