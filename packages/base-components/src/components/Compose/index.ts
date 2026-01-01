import { mapObject } from '@game-cms/shared/object';
import { component } from '@game-cms/utils';

import meta from './meta.js';
import { validator } from './validator.js';

export * from './types.js';

export default component({
  meta,
  validator,
  resolver: (raw, options, context, args) => {
    return mapObject(raw, (value, key) => {
      const { componentId, options: itemOptions } = options[key];

      return context.resolveRawData(componentId, value, itemOptions, args);
    });
  },
});
