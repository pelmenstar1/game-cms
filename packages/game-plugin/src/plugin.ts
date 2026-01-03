import path from 'node:path';

import type { Plugin } from '@game-cms/core';
import { getImportDirectory } from '@game-cms/shared/node';

export const gamePlugin: Plugin = {
  components: () => {
    const rootDir = getImportDirectory(
      import.meta.resolve('@game-cms/game-plugin-components')
    );

    return {
      distributionPath: path.join(rootDir, 'components'),
    };
  },
};
