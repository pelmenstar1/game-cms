import { defineComponentCore } from '@game-cms/core';

import { ComposeId, composeId } from '../../types/compose.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';
import { id } from './types.js';

export default defineComponentCore({
  id,
  defaultOutData: (options, context) =>
    context.getDefaultData<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions(options)
    ),
  pathWalker: (data, options, path, apply, context) => {
    context.applyAtPath(
      composeId,
      data,
      getComposeOptions(options),
      path,
      apply
    );
  },
});
