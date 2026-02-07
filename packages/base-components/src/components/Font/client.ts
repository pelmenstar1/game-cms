import { ComponentClientDataTransformer } from '@game-cms/core';

import { getRepeatableOptions, RepeatableArgs } from './internal/repeatable.js';

export const clientTransformer: ComponentClientDataTransformer<'base::font'> = {
  getDefaultData: (options, context) =>
    context.getDefaultData<'base::repeatable', RepeatableArgs>(
      'base::repeatable',
      getRepeatableOptions(options)
    ),
  toClient: (data, options, context) =>
    context.toClient<'base::repeatable', RepeatableArgs>(
      'base::repeatable',
      data,
      getRepeatableOptions(options)
    ),
  fromClient: (clientData, options, context) =>
    context.fromClient<'base::repeatable', RepeatableArgs>(
      'base::repeatable',
      clientData,
      getRepeatableOptions(options)
    ),
};
