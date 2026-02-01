import { defineComponentController } from '@game-cms/core';

import core from './core.js';
import { getDefaultData } from './internal/defaultData.js';

export default defineComponentController({
  core,
  storageTransformer: {
    getDefaultData,
    fromStorage: (data) => data.toISOString(),
    toStorage: (data) => {
      return new Date(data);
    },
  },
});
