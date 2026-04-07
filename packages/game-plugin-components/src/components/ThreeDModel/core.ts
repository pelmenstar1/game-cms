import { defineComponentCore } from '@game-cms/core';

import { ComposeId, composeId } from '../../types/compose.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';
import { id } from './types.js';

export default defineComponentCore({
  id,
  defaultOutData: (_, context) =>
    context.getDefaultData<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions()
    ),
  pathWalker: (data, _, path, apply, context) => {
    context.applyAtPath(composeId, data, getComposeOptions(), path, apply);
  },
});
