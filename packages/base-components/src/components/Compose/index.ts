/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { mapObject } from '@game-cms/shared/object';
import { component } from '@game-cms/utils';

import meta from './meta.js';
import { ComposeData, ComposeError, ComposeOptions } from './types.js';
import { validator } from './validator.js';

export * from './types.js';

export default component<
  ComposeOptions,
  ComposeData,
  ComposeError,
  'base::compose'
>({
  meta,
  validator,
  resolver: (raw, options, context, args) => {
    return mapObject(raw, (value, key) => {
      const { componentId, options: itemOptions } = options[key];

      return context.data(componentId, value, itemOptions, args);
    });
  },
});
