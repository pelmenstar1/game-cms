import fsp from 'node:fs/promises';

import { initEnvFromConfigs } from '@game-cms/ignition';
import type { DashboardMeta } from '@game-cms/types';
import type { Plugin, PluginOption } from 'vite';

import { dashboardComponentsPlugin } from '../components/plugin.js';

export async function ignitePlugin(): Promise<PluginOption> {
  const meta = JSON.parse(
    await fsp.readFile('./.game-cms/meta.json', 'utf8')
  ) as DashboardMeta;

  await initEnvFromConfigs(meta.basePath);

  const plugin: Plugin = {
    name: 'game-cms:ignite',
    enforce: 'pre',
    buildStart: async () => {},
  };

  return [plugin, dashboardComponentsPlugin()];
}
