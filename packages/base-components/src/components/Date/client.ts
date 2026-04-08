import { defineComponentClientController } from '@game-cms/core';
import { resolveDateLike } from '@game-cms/shared/chrono';

import core from './core.js';
import { Id } from './types.js';
import { validator } from './validator.js';

export default defineComponentClientController<Id>({
  core,
  meta: {
    ui: {
      compact: true,
    },
  },
  validator: (data, options) => {
    if (data instanceof Date) {
      return validator(data, options);
    }

    return 'INVALID_TYPE';
  },
  getDefaultData: (options) =>
    options.minDate ? resolveDateLike(options.minDate) : new Date(),
  transformer: {
    toClient: (data) => new Date(data),
    fromClient: (data) => data.toISOString(),
  },
});
