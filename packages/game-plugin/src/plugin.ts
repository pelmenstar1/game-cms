import path from 'node:path';

import type { Plugin } from '@game-cms/core';
import { resolveImportDirectory } from '@game-cms/shared/node';

export const gamePlugin: Plugin = {
  id: 'game',
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
