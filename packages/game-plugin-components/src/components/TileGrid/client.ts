import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';
import { validator } from './shared.js';

export default defineComponentClientController({
  core,
  validator,
});
