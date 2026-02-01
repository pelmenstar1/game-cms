import { defineComponentController } from '@game-cms/core';

import core from './core.js';

export default defineComponentController({
  core,
  migrate: (data) => {
    if (Array.isArray(data) && data.every((item) => typeof item === 'string')) {
      return data;
    }
  },
});
