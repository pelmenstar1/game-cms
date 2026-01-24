import { componentController } from '@game-cms/core';

import core from './core.js';

export default componentController({
  core,
  migrate: (data) => {
    if (typeof data === 'string') {
      return data;
    }
  },
});
