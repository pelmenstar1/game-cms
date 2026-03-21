import { ComponentClientDataTransformer } from '@game-cms/core';

import {
  getRepeatableClientOptions,
  RepeatableArgs,
} from './internal/repeatable.js';

const id = 'base::repeatable';

type Id = typeof id;

export const clientTransformer: ComponentClientDataTransformer<'base::font'> = {
  getDefaultData: (options, context) =>
    context.getDefaultData<Id, RepeatableArgs>(
      id,
      getRepeatableClientOptions(options)
    ),
  toClient: (data, options, context) =>
    context.toClient<Id, RepeatableArgs>(
      id,
      data,
      getRepeatableClientOptions(options)
    ),
  fromClient: (clientData, options, context) =>
    context.fromClient<Id, RepeatableArgs>(
      id,
      clientData,
      getRepeatableClientOptions(options)
    ),
};
