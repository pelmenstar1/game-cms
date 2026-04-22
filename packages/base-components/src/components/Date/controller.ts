import { defineComponentController } from '@game-cms/core';
import { isValidDate } from '@game-cms/shared/chrono';

import core from './core.js';
import { getDefaultData } from './internal/defaultData.js';
import { computeDateScore, createDateIndex } from './search.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  migrate: (data) => {
    if (data instanceof Date) {
      return data;
    } else if (typeof data === 'string') {
      const parsedDate = new Date(data);

      if (isValidDate(parsedDate)) {
        return parsedDate;
      }
    }
  },
  validator: (data, options) => {
    if (typeof data === 'string') {
      const date = new Date(data);

      return validator(date, options);
    }

    return 'INVALID_TYPE';
  },
  storageTransformer: {
    getDefaultData,
    fromStorage: (data) => data.toISOString(),
    toStorage: (data) => new Date(data),
  },
  search: {
    createIndex: (data) => createDateIndex(data),
    getScore: (query, target) =>
      computeDateScore(query, target.storage, target.searchIndex),
  },
});
