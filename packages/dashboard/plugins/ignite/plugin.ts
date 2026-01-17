import type { DashboardMeta } from '@game-cms/core';
import { env } from '@game-cms/global';
import { initEnvFromConfigs } from '@game-cms/ignition';
import { filterOutNullable } from '@game-cms/shared/collections';
import { isFileNotFoundError } from '@game-cms/shared/errors';
import { readJson } from '@game-cms/shared/io';
import type { PluginOption } from 'vite';

import { dashboardComponentsPlugin } from '../components/plugin.js';
import { devPlugin } from '../dev/plugin.js';
import { i18nPlugin } from '../i18n/plugin.js';

async function tryReadMeta() {
  try {
    return await readJson<DashboardMeta>('./.game-cms/meta.json');
  } catch (error) {
    if (isFileNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function ignitePlugin(): Promise<PluginOption> {
  const meta = await tryReadMeta();
  if (meta === null) {
    return [];
  }

  await initEnvFromConfigs(meta.basePath);

  const plugins = filterOutNullable(
    env().config.plugins.flatMap((plugin) => plugin.dashboard?.plugins)
  );

  return [
    dashboardComponentsPlugin(),
    i18nPlugin(),
    devPlugin({ messagePort: meta.devMessagePort }),
    ...plugins,
  ];
}
