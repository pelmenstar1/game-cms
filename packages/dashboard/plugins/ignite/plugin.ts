import { env } from '@game-cms/global';
import { initEnvFromConfigs, readDashboardBuildMeta } from '@game-cms/ignition';
import { filterOutNullable } from '@game-cms/shared/collections';
import type { Plugin } from 'vite';

import { dashboardComponentsPlugin } from '../components/plugin.js';
import { devPlugin } from '../dev/plugin.js';
import { i18nPlugin } from '../i18n/plugin.js';

export async function ignitePlugin(): Promise<Plugin[]> {
  const meta = await readDashboardBuildMeta();
  if (meta === null) {
    return [];
  }

  await initEnvFromConfigs(meta.basePath);

  const plugins = filterOutNullable(
    env().config.plugins.flatMap(
      (plugin) => plugin.config?.dashboard?.vite?.plugins
    )
  );

  return [
    dashboardComponentsPlugin(),
    i18nPlugin(),
    devPlugin({ messageTunnel: meta.devMessageTunnel }),
    ...plugins,
  ];
}
