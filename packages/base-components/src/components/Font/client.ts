import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';
import {
  getRepeatableClientOptions,
  RepeatableArgs,
  RepeatableId,
} from './internal/repeatable.js';

export default defineComponentClientController({
  core,
  meta: {
    ui: {
      compact: true,
    },
  },
  getDefaultData: (options, context) =>
    context.getDefaultData<RepeatableId, RepeatableArgs>(
      'base::repeatable',
      getRepeatableClientOptions(options)
    ),
  validator: (data, options, context) => {
    return context.validate<RepeatableId, RepeatableArgs>(
      'base::repeatable',
      data,
      getRepeatableClientOptions(options)
    );
  },
  transformer: {
    toClient: (data, options, context) =>
      context.toClient<RepeatableId, RepeatableArgs>(
        'base::repeatable',
        data,
        getRepeatableClientOptions(options)
      ),
    fromClient: (clientData, options, context) =>
      context.fromClient<RepeatableId, RepeatableArgs>(
        'base::repeatable',
        clientData,
        getRepeatableClientOptions(options)
      ),
  },
});
