import fsp from 'node:fs/promises';

import { env } from '@game-cms/global';
import { initEnvFromConfigs } from '@game-cms/ignition';
import { filterOutNullable } from '@game-cms/shared/collections';
import type { DashboardMeta } from '@game-cms/types';
import type { PluginOption } from 'vite';

import { dashboardComponentsPlugin } from '../components/plugin.js';

export async function ignitePlugin(): Promise<PluginOption> {
  const meta = JSON.parse(
    await fsp.readFile('./.game-cms/meta.json', 'utf8')
  ) as DashboardMeta;

  await initEnvFromConfigs(meta.basePath);

  const plugins = filterOutNullable(
    env().config.plugins.flatMap((plugin) => plugin.dashboard?.plugins)
  );

  return [dashboardComponentsPlugin(), ...plugins];
}
