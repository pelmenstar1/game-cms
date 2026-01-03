import { component } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  validator,
  defaultRawData,
  resolver: (raw, options, context, args) => {
    return mapObject(raw, (value, key) => {
      const { componentId, options: itemOptions } = options[key];

      return context.resolveRawData(componentId, value, itemOptions, args);
    });
  },
});
