import { defineComponentController } from '@game-cms/core';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  validator,
  migrate: (data) => {
    if (Array.isArray(data) && data.every((item) => typeof item === 'string')) {
      return data;
    }
  },
});
