import { defineComponentCore } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

export default defineComponentCore({
  id: 'base::compose',
  defaultOutData: (options, context) => {
    return mapObject(options, (item) =>
      context.getDefaultData(item.componentId, item.options)
    );
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
});
