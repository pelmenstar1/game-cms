import { componentController } from '@game-cms/core';

import core from './core.js';

export default componentController({
  core,
  storageTransformer: {
    fromStorage: (data) => data.toISOString(),
    toStorage: (data) => {
      return new Date(data);
    },
  },
});
