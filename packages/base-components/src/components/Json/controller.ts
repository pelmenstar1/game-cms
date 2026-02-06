import { defineComponentController } from '@game-cms/core';

import core from './core.js';

function baseSplitObjectToKeywords(value: unknown, output: string[]) {
  switch (typeof value) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string': {
      output.push(value.toString());
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
        for (const key in value) {
          output.push(key);
          baseSplitObjectToKeywords(value[key as never], output);
        }
      }
    }
  }
}

function splitObjectToKeywords(value: unknown) {
  const output: string[] = [];
  baseSplitObjectToKeywords(value, output);

  return output;
}

export default defineComponentController({
  core,
  migrate: (data) => data,
  search: (query, data) => {
    const keywords = splitObjectToKeywords(data);

    return keywords.some((keyboard) => keyboard.startsWith(query)) ? 1 : 0;
  },
});
