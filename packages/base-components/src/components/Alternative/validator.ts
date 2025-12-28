import { componentDataValidator } from '@game-cms/utils';

import {
  AlternativeData,
  AlternativeError,
  AlternativeOptions,
} from './types.js';

export const validator = componentDataValidator(
  (data: AlternativeData, options: AlternativeOptions, context) => {
    const { componentId, baseOptions } = options;

    const result: AlternativeError = {
      default: context.data(componentId, data.default, baseOptions),
      alternative: data.alternative.map((item) => ({
        condition: undefined,
        data: context.data(componentId, item, baseOptions),
      })),
    };

    if (
      result.default !== undefined ||
      result.alternative.some((item) => item.data !== undefined)
    ) {
      return result;
    }
  }
);
