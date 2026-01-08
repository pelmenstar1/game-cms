import { component } from '@game-cms/core';
import { asyncMapObject, mapObject } from '@game-cms/shared/object';

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
  pathWalker: (data, options, path, apply, context) => {
    const dotIndex = path.indexOf('.');

    if (dotIndex !== -1) {
      const prefix = path.slice(0, dotIndex);
      const suffix = path.slice(dotIndex + 1);

      const value = data[prefix];
      const { componentId, options: baseOptions } = options[prefix];

      context.applyAtPath(componentId, value, baseOptions, suffix, apply);
    } else {
      apply(data[path]);
    }
  },
  storageTransformer: {
    fromStorage: (data, options, context) => {
      return asyncMapObject(data, (item, key) => {
        const { componentId, options: baseOptions } = options[key];

        return context.fromStorage(componentId, item as never, baseOptions);
      });
    },
    toStorage: (data, options, context) => {
      return asyncMapObject(data, (item, key) => {
        const { componentId, options: baseOptions } = options[key];

        return context.toStorage(componentId, item as never, baseOptions);
      });
    },
  },
});
