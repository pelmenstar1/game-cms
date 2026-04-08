import fs from 'node:fs';

import { EntityEnvConfig } from '@game-cms/base-core';
import type { PluginValueSourceContext } from '@game-cms/core';
import { maybeJitiImport } from '@game-cms/shared/node';
import { mapObject } from '@game-cms/shared/object';
import { createJiti } from 'jiti';

import { validateEntitySchemaMap } from './validate.js';

const SCHEMA_REGISTRY_PATH = 'entities/registry.ts';
const CLIENT_CONTEXT_REGISTRY_PATH = 'entities/registry.client.ts';

function getClientContextRegistryPath(context: PluginValueSourceContext) {
  const filePath = context.compiledFilePath(CLIENT_CONTEXT_REGISTRY_PATH);

  if (fs.existsSync(filePath)) {
    return { filePath };
  }
}

async function resolveSchemaRegistry(schemaRegistryFilePath: string) {
  const jiti = createJiti(import.meta.url);
  const schemaRegistry = await maybeJitiImport(jiti, schemaRegistryFilePath);

  if (schemaRegistry !== undefined) {
    validateEntitySchemaMap(schemaRegistry);
  }

  return schemaRegistry;
}

export async function resolveEntityEnvConfig(
  context: PluginValueSourceContext
): Promise<EntityEnvConfig> {
  const schemaRegistryFilePath = context.compiledFilePath(SCHEMA_REGISTRY_PATH);

  const schemaRegistry = await resolveSchemaRegistry(schemaRegistryFilePath);

  return {
    schemaRegistry: schemaRegistry && {
      filePath: schemaRegistryFilePath,
      items: mapObject(schemaRegistry, (schema) => ({
        schema,
      })),
    },
    clientContextRegistry: getClientContextRegistryPath(context),
  };
}
