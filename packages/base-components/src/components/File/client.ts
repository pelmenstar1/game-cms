import { defineComponentClientController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentClientController({
  core,
  meta: {
    ui: {
      compact: true,
    },
  },
  getDefaultData: () => [],
  validator: (data, options) => validator(data, options, isNonNullObject),
  transformer: {
    toClient: (data) => {
      return data.map((item) => ({
        ...item,
        id: item.id.toString(),
        parent: item.parent?.toString(),
        originFile: item.originFile?.toString(),
      }));
    },
    fromClient: (clientData) => {
      return clientData.map((item) => item.id);
    },
  },
});
