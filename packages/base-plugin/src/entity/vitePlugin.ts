import { virtualModulePlugin } from '@game-cms/shared/vite';
import type { Plugin as VitePlugin } from 'vite';

import { emitEntityConnector } from './connector.js';

export function dashboardEntityPlugin(): VitePlugin {
  return virtualModulePlugin({
    pluginId: 'game-cms:dashboard-entity',
    moduleId: 'virtual:dashboard/entityConnectorData',
    generator: emitEntityConnector,
  });
}
