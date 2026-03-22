import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';
import {
  getRepeatableClientOptions,
  RepeatableArgs,
} from './internal/repeatable.js';

const id = 'base::repeatable';

type Id = typeof id;

export default defineComponentClientController<'base::font'>({
  core,
  meta: {
    ui: {
      compact: true,
    },
  },
  getDefaultData: (options, context) =>
    context.getDefaultData<Id, RepeatableArgs>(
      id,
      getRepeatableClientOptions(options)
    ),
  validator: (data, options, context) => {
    return context.validate<Id, RepeatableArgs>(
      id,
      data,
      getRepeatableClientOptions(options)
    );
  },
  transformer: {
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
  },
});
