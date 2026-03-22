import { defineComponentController } from '@game-cms/core';
import { ObjectId } from 'mongodb';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  validator,
  storageTransformer: {
    getDefaultData: () => null,
    toStorage: (data) => (data ? new ObjectId(data) : null),
    fromStorage: (storageData) => storageData?.toString() ?? null,
  },
});
