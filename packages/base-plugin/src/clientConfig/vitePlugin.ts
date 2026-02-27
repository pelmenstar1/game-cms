import type { Plugin as VitePlugin } from 'vite';

import { emitClientConfigConnector } from './connector.js';

const CONNECTOR_ID = 'virtual:dashboard/clientConfigConnectorData';

export function clientConfigPlugin(): VitePlugin {
  return {
    name: 'game-cms:dashboard-client-config',
    resolveId(id) {
      if (id === CONNECTOR_ID) {
        return CONNECTOR_ID;
      }

      return null;
    },
    load(id) {
      if (id === CONNECTOR_ID) {
        const code = emitClientConfigConnector();

        return { code };
      }
    },
  };
}
