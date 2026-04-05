import {
  ComponentClientChunkMap,
  emitComponentConnector,
} from '@game-cms/core/node';
import type { Plugin } from 'vite';

import { gatherRequiredComponents } from './gather';

const COMPONENT_RENDERER_PROTOCOL = 'component-renderer:';
const CONNECTOR_ID = 'virtual:dashboard/componentConnectorData';

export function dashboardComponentsPlugin(): Plugin {
  let components: ComponentClientChunkMap;

  return {
    name: 'game-cms:dashboard-components',
    async buildStart() {
      components = await gatherRequiredComponents();
    },
    resolveId(source) {
      if (source === CONNECTOR_ID) {
        return CONNECTOR_ID;
      }

      if (source.startsWith(COMPONENT_RENDERER_PROTOCOL)) {
        const componentId = source.slice(COMPONENT_RENDERER_PROTOCOL.length);
        const entry = components[componentId];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!entry) {
          throw new Error(`Unknown component: ${componentId}`);
        }

        return entry.paths.renderers.default;
      }

      return null;
    },
    load(id) {
      if (id === CONNECTOR_ID) {
        return emitComponentConnector(components);
      }
    },
  };
}
