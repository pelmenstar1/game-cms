import { defineComponentController } from '@game-cms/core';

import core from './core.js';

export default defineComponentController({
  core,
  migrate: (data) => data,
});
