import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentClientController({
  core,
  meta: {
    ui: {
      compact: true,
    },
  },
  validator,
});
