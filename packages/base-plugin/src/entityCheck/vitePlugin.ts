import { virtualModulePlugin } from '@game-cms/shared/vite';
import type { Plugin as VitePlugin } from 'vite';

import { emitEntityCheckConnector } from './connector.js';

export function entityCheckPlugin(): VitePlugin {
  return virtualModulePlugin({
    pluginId: 'game-cms:dashboard-entity-check',
    moduleId: 'virtual:dashboard/entityCheckConnectorData',
    generator: emitEntityCheckConnector,
  });
}
