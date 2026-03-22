import { defineComponentCore } from '@game-cms/core';

import { ComposeArgs, getComposeOptions } from './internal/options.js';

export default defineComponentCore({
  id: 'game::spritesheet',
  defaultOutData: (options, context) =>
    context.getDefaultData<'base::compose', ComposeArgs>(
      'base::compose',
      getComposeOptions(options)
    ),
  pathWalker: (data, options, path, apply, context) => {
    context.applyAtPath(
      'base::compose',
      data,
      getComposeOptions(options),
      path,
      apply
    );
  },
});
