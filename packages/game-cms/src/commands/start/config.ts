import { importFile, resolveMaybeFactory } from '@game-cms/shared';
import { createEnvAccessor } from '@game-cms/shared';
import type { CmsConfig } from '@game-cms/types';

import type { ConfigInit } from '../../types/config.js';
import { compiledFilePath } from '../../utils/localPath.js';

async function importConfig(filePath: string) {
  const { default: result } = await importFile<{ default: ConfigInit }>(
    filePath
  );

  return result;
}

export async function resolveConfig(): Promise<CmsConfig> {
  const configPath = compiledFilePath('cms.config.js');
  const configInit = await importConfig(configPath);

  return resolveMaybeFactory(configInit, createEnvAccessor());
}
