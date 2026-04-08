import { defineComponentClientController } from '@game-cms/core';
import { safeParseFloat } from '@game-cms/shared/string';

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
    if (typeof data === 'string') {
      const result = safeParseFloat(data);

      if (result !== null) {
        return validator(result, options);
      }
    }

    return 'NAN';
  },
  getDefaultData: () => '0',
  transformer: {
    fromClient: (data) => {
      const result = safeParseFloat(data);
      if (result === null) {
        throw new Error(`Invalid number format: ${data}`);
      }

      return result;
    },
    toClient: (data) => data.toString(),
  },
});
