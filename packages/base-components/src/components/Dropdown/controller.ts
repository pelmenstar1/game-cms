import { defineComponentController } from '@game-cms/core';

import core from './core.js';

export default defineComponentController({
  core,
  migrate: (data) => {
    if (typeof data === 'string') {
      return data;
    }
  },
  search: {
    getScore: (query, target) => {
      return target.storage.includes(query.toLowerCase()) ? 1 : 0;
    },
  },
});
