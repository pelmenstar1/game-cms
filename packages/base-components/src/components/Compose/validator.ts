import { componentDataValidator } from '@game-cms/utils';

import { ComposeData, ComposeError, ComposeOptions } from './types.js';

export const validator = componentDataValidator(
  (
    data: ComposeData,
    options: ComposeOptions,
    context
  ): ComposeError | undefined => {
    const entries = Object.entries(options).map(
      ([key, { componentId, options }]) =>
        [key, context.data(componentId, data[key], options)] as const
    );

    if (entries.some(([, value]) => value !== undefined)) {
      return Object.fromEntries(entries);
    }
  }
);
