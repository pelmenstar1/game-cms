import { defineComponentController } from '@game-cms/core';
import { safeParseFloat } from '@game-cms/shared/string';

import core from './core.js';

// Give 10% leeway of the data value.
export const SEARCH_LEEWAY = 0.1;

export default defineComponentController({
  core,
  migrate: (data) => {
    if (typeof data === 'string') {
      const result = safeParseFloat(data);

      if (result !== null) {
        return result;
      }
    } else if (typeof data === 'number') {
      return data;
    }

    return 0;
  },
  search: {
    getScore: (query, target) => {
      const { storage } = target;
      const queryNumber = safeParseFloat(query);

      if (queryNumber !== null) {
        const low = storage * (1 - SEARCH_LEEWAY);
        const high = storage * (1 + SEARCH_LEEWAY);

        if (queryNumber >= low && queryNumber <= high) {
          const distance = Math.abs(storage - queryNumber);
          const maxDistance = high - low;

          return 1 - distance / maxDistance;
        }
      }

      return 0;
    },
  },
});
