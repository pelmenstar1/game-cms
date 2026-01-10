import { component } from '@game-cms/core';

import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  defaultRawData,
  validator,
  storageTransformer: {
    fromStorage: (data) => data.toISOString(),
    toStorage: (data) => {
      return new Date(data);
    },
  },
});
