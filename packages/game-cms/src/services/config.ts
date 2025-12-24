import { basePlugin } from '@game-cms/base-plugin';
import { resolveMaybeFactory } from '@game-cms/shared';
import { importFile } from '@game-cms/shared/io';
import { createEnvAccessor } from '@game-cms/shared/io';
import type { ResolvedCmsConfig } from '@game-cms/types';

import type { ConfigInit } from '../types/config.js';
import { compiledFilePath } from './localPath.js';

async function importConfig(filePath: string) {
  const { default: result } = await importFile<{ default: ConfigInit }>(
    filePath
  );

  return result;
}

export async function resolveConfig(): Promise<ResolvedCmsConfig> {
  const configPath = compiledFilePath('cms.config.js');
  const configInit = await importConfig(configPath);

  const instance = await resolveMaybeFactory(configInit, createEnvAccessor());

  return {
    ...instance,
    plugins: [basePlugin, ...(instance.plugins ?? [])],
  };
}
