import {
  conditionalAstExpressionToString,
  parseConditionalNotation,
} from '@game-cms/conditional';
import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentClientController({
  core,
  validator: (data, options, context) => {
    const { componentId, baseOptions } = options;

    return validator(
      data,
      (element) => context.validate(componentId, element, baseOptions),
      (condition) => {
        if (typeof condition !== 'string') return 'INVALID_CONDITION';

        try {
          parseConditionalNotation(condition);
        } catch (error) {
          return error instanceof Error ? error.message : 'Unknown error';
        }
      }
    );
  },
  getDefaultData: (options, context) => ({
    default: context.getDefaultData(options.componentId, options.baseOptions),
    alternative: [],
  }),
  transformer: {
    toClient: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return {
        default: context.toClient(componentId, data.default, baseOptions),
        alternative: data.alternative.map((item) => ({
          condition: conditionalAstExpressionToString(item.condition),
          value: context.toClient(componentId, item.value, baseOptions),
        })),
      };
    },
    fromClient: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return {
        default: context.fromClient(componentId, data.default, baseOptions),
        alternative: data.alternative.map(({ value, condition }) => ({
          condition: parseConditionalNotation(condition),
          value: context.fromClient(componentId, value, baseOptions),
        })),
      };
    },
  },
});
