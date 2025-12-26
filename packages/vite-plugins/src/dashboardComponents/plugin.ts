import { DASHBOARD_COMPONENTS_PATH } from '@game-cms/build';
import { readJson } from '@game-cms/shared/io';
import type { ComponentsFsInfo } from '@game-cms/types';
import type { Plugin } from 'vite';

import { emitComponentConnector } from './connector.js';
import { type ComponentClientChunkMap, gatherComponents } from './gather.js';

const COMPONENT_PROTOCOL = 'component:';
const CONNECTOR_ID = 'virtual:dashboard/componentConnector';

export function dashboardComponentsPlugin(): Plugin {
  let components: ComponentClientChunkMap;

  return {
    name: 'game-cms:dashboard-components',
    async buildStart() {
      const fsInfo = await readJson<ComponentsFsInfo>(
        DASHBOARD_COMPONENTS_PATH
      );

      components = await gatherComponents(fsInfo);
    },
    resolveId(source) {
      if (source === CONNECTOR_ID) {
        return CONNECTOR_ID;
      }

      if (source.startsWith(COMPONENT_PROTOCOL)) {
        const componentId = source.slice(COMPONENT_PROTOCOL.length);
        const entry = components[componentId];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!entry) {
          throw new Error(`Unknown component: ${componentId}`);
        }

        return entry.mainFilePath;
      }

      return null;
    },
    load(id) {
      if (id === CONNECTOR_ID) {
        const code = emitComponentConnector(components);

        console.log(code);

        return { code };
      }
    },
  };
}
