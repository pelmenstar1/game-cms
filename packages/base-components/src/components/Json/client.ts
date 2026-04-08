import { defineComponentClientController } from '@game-cms/core';
import { InvalidJson, parseJsonOptional } from '@game-cms/shared/json';

import core from './core.js';
import { Id } from './types.js';
import { validator } from './validator.js';

export default defineComponentClientController<Id>({
  core,
  validator: (data, options) => {
    if (typeof data !== 'string') {
      return 'INVALID_FORMAT';
    }

    if (options.allowEmpty && data === '') {
      return;
    }

    const parsed = parseJsonOptional(data);
    if (parsed === InvalidJson) {
      return 'INVALID_FORMAT';
    }

    return validator(parsed, options);
  },
  getDefaultData: ({ allowEmpty }) => (allowEmpty ? '' : '{}'),
  transformer: {
    toClient: (data) => JSON.stringify(data, null, 2),
    fromClient: (data) => {
      const parsed = parseJsonOptional(data);
      if (parsed === InvalidJson) {
        throw new Error('Invalid JSON format');
      }

      return parsed;
    },
  },
});
