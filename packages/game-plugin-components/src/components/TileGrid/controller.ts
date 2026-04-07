import {
  ComponentStorageDataById,
  defineComponentController,
} from '@game-cms/core';

import core from './core.js';
import { validator } from './shared.js';
import { Id } from './types.js';

export default defineComponentController({
  core,
  validator,
  migrate: (data, options) => {
    if (validator(data, options) === undefined) {
      return data as ComponentStorageDataById<Id>;
    }
  },
});
