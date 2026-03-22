import { defineComponentController } from '@game-cms/core';
import { isValidDate } from '@game-cms/shared/chrono';

import core from './core.js';
import { getDefaultData } from './internal/defaultData.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  validator: (data, options) => {
    if (typeof data === 'string') {
      const date = new Date(data);

      if (isValidDate(date)) {
        return validator(date, options);
      }
    }

    return 'INVALID_TYPE';
  },
  storageTransformer: {
    getDefaultData,
    fromStorage: (data) => data.toISOString(),
    toStorage: (data) => {
      return new Date(data);
    },
  },
});
