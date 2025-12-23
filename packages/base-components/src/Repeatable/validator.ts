import { ComponentData } from '@game-cms/types';
import { componentDataValidator } from '@game-cms/utils';

import { RepeatableOptions } from './types';

export const validator = componentDataValidator(
  (data: ComponentData[], options: RepeatableOptions, context) => {
    const validator = context.validation.data(options.controller);

    const result = data.map((element) =>
      validator(element, options.base, context)
    );

    return result.every((element) => element === undefined)
      ? undefined
      : result;
  }
);
