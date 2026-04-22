import { defineComponentController } from '@game-cms/core';

import core from './core.js';
import { validator } from './validator.js';

function baseSplitObjectToKeywords(value: unknown, output: Set<string>) {
  switch (typeof value) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string': {
      output.add(value.toString());
      break;
    }
    case 'object': {
      if (value === null) {
        return;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          baseSplitObjectToKeywords(item, output);
        }
      } else {
        type K = keyof typeof value;

        for (const key in value) {
          output.add(key);
          baseSplitObjectToKeywords(value[key as K], output);
        }
      }
    }
  }
}

function splitObjectToKeywords(value: unknown) {
  const output: Set<string> = new Set();
  baseSplitObjectToKeywords(value, output);

  return [...output];
}

export default defineComponentController({
  core,
  validator,
  migrate: (data) => data,
  search: {
    getScore: (query, target) => {
      return target.searchIndex.some((keyboard) => keyboard.startsWith(query))
        ? 1
        : 0;
    },
    createIndex: (data) => {
      return splitObjectToKeywords(data);
    },
  },
});
