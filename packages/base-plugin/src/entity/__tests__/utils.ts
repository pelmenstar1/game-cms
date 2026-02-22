import path from 'node:path';

import { PluginValueSourceContext } from '@game-cms/core';

import { resolveEntityEnvConfig } from '../resolver.js';

export function getEntityEnvConfigSetup(setupName: string) {
  return resolveEntityEnvConfig({
    compiledFilePath: (name) =>
      path.join(import.meta.dirname, `fixtures/${setupName}`, name),
  } as PluginValueSourceContext);
}
