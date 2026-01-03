import { component } from '@game-cms/core';

import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  validator,
  defaultRawData,
  resolver: (raw, options, context, args) => {
    const { baseOptions, componentId } = options;

    return raw.map((item) =>
      context.resolveRawData(componentId, item, baseOptions, args)
    );
  },
  storageResolver: {
    fromStorage: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return Promise.all(
        // eslint-disable-next-line @typescript-eslint/await-thenable
        data.map((item) => context.fromStorage(componentId, item, baseOptions))
      );
    },
    toStorage: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return Promise.all(
        // eslint-disable-next-line @typescript-eslint/await-thenable
        data.map((item) => context.toStorage(componentId, item, baseOptions))
      );
    },
  },
});
