import { defineComponentController } from '@game-cms/core';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  validator,
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
