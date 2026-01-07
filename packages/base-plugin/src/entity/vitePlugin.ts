import type { Plugin as VitePlugin } from 'vite';

import { emitEntityConnector } from './connector.js';

const CONNECTOR_ID = 'virtual:dashboard/entityConnectorData';

export function dashboardEntityPlugin(): VitePlugin {
  return {
    name: 'game-cms:dashboard-entity',
    resolveId(id) {
      if (id === CONNECTOR_ID) {
        return CONNECTOR_ID;
      }

      return null;
    },
    load(id) {
      if (id === CONNECTOR_ID) {
        const code = emitEntityConnector();

        return { code };
      }
    },
  };
}
