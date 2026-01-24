import { componentController } from '@game-cms/core';
import { isFloatString } from '@game-cms/shared';

import core from './core.js';

export default componentController({
  core,
  migrate: (data) => {
    if (typeof data === 'string') {
      const result = Number.parseFloat(data);

      if (!Number.isNaN(result) && isFloatString(data)) {
        return result;
      }
    } else if (typeof data === 'number') {
      return data;
    }

    return 0;
  },
});
