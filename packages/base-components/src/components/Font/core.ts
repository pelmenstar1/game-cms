import { defineComponentCore } from '@game-cms/core';

import { getRepeatableOptions, RepeatableArgs } from './internal/repeatable.js';

export default defineComponentCore({
  id: 'base::font',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultOutData: () => [],
  validator: (data, options, context) => {
    return context.validate<'base::repeatable', RepeatableArgs>(
      'base::repeatable',
      data,
      getRepeatableOptions(options)
    );
  },
});
