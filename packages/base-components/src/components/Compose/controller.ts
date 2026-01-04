import { component } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  validator,
  defaultRawData,
  resolver: (raw, options, context, args) => {
    return mapObject(raw, (value, key) => {
      const { componentId, options: baseOptions } = options[key];

      return context.resolveRawData(componentId, value, baseOptions, args);
    });
  },
  storageResolver: {
    fromStorage: (data, options, context) => {
      return mapObject(data, (item, key) => {
        const { componentId, options: baseOptions } = options[key];

        return context.fromStorage(componentId, item as never, baseOptions);
      });
    },
    toStorage: (data, options, context) => {
      return mapObject(data, (item, key) => {
        const { componentId, options: baseOptions } = options[key];

        return context.toStorage(componentId, item, baseOptions);
      });
    },
  },
});
