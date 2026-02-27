import path from 'node:path';

import type { Plugin } from '@game-cms/core';
import {
  resolveImportDirectory,
  resolveImportFile,
} from '@game-cms/shared/node';

export const gamePlugin: Plugin = {
  id: 'game',
  config: {
    client: {
      filePath: resolveImportFile(import.meta, './config.client.js'),
    },
  },
  components: () => {
    const rootDir = resolveImportDirectory(
      import.meta,
      '@game-cms/game-plugin-components'
    );

    return {
      distributionPath: path.join(rootDir, 'components'),
    };
  },
};
