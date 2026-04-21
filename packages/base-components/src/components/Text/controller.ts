import { defineComponentController } from '@game-cms/core';

import core from './core.js';
import { computeHybridScore, createTextIndex } from './search.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  validator,
  migrate: (data) => {
    if (typeof data === 'string' || typeof data === 'number') {
      return data.toString();
    }
  },
  search: {
    createIndex: (data) => createTextIndex(data),
    getScore: (query, target) => computeHybridScore(query, target.searchIndex),
  },
});
