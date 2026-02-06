import { defineComponentController } from '@game-cms/core';

import core from './core.js';

export default defineComponentController({
  core,
  migrate: (data) => {
    if (typeof data === 'string' || typeof data === 'number') {
      return data.toString();
    }
  },
  search: (query, value) => {
    return value.startsWith(query) ? 1 : 0;
  },
});
