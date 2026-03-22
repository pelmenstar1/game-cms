import { defineComponentController } from '@game-cms/core';

import core from './core.js';
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
    getScore: (query, target) => {
      return target.storage.startsWith(query) ? 1 : 0;
    },
  },
});
