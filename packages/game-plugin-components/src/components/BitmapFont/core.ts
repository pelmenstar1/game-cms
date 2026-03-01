import { defineComponentCore } from '@game-cms/core';

import { ComposeArgs, getComposeOptions } from './internal/options.js';

export default defineComponentCore({
  id: 'game::bitmap-font',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultOutData: (_, context) =>
    context.getDefaultData<'base::compose', ComposeArgs>(
      'base::compose',
      getComposeOptions()
    ),
  pathWalker: (data, _, path, apply, context) => {
    context.applyAtPath(
      'base::compose',
      data,
      getComposeOptions(),
      path,
      apply
    );
  },
  validator: (data, _, context) =>
    context.validate<'base::compose', ComposeArgs>(
      'base::compose',
      data,
      getComposeOptions()
    ),
});
