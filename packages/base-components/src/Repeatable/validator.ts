import { ComponentData } from '@game-cms/types';
import { componentDataValidator } from '@game-cms/utils';

import { RepeatableOptions } from './types.js';

export const validator = componentDataValidator(
  (data: ComponentData[], options: RepeatableOptions, context) => {
    const result = data.map((element) =>
      context.data(options.controller, element, options.base)
    );

    return result.every((element) => element === undefined)
      ? undefined
      : result;
  }
);
