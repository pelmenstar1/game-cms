import { virtualModulePlugin } from '@game-cms/shared/vite';
import type { Plugin as VitePlugin } from 'vite';

import { emitClientConfigConnector } from './connector.js';

export function clientConfigPlugin(): VitePlugin {
  return virtualModulePlugin({
    pluginId: 'game-cms:dashboard-client-config',
    moduleId: 'virtual:dashboard/clientConfigConnectorData',
    generator: emitClientConfigConnector,
  });
}
