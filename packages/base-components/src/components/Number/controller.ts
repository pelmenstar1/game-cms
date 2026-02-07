import { defineComponentController } from '@game-cms/core';
import { isFloatString } from '@game-cms/shared';

import core from './core.js';

export default defineComponentController({
  core,
  migrate: (data) => {
    if (typeof data === 'string') {
      const result = Number.parseFloat(data);

      if (!Number.isNaN(result) && isFloatString(data)) {
        return result;
      }
    } else if (typeof data === 'number') {
      return data;
    }

    return 0;
  },
  search: {
    getScore: (query, target) => {
      if (target.storage.toString() === query) {
        return 1;
      }

      return 0;
    },
  },
});
