import { defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'base::checkbox',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultRawData: () => [],
  validator: (data, options) => {
    if (
      !Array.isArray(data) ||
      data.some((item) => !(item in options.choices))
    ) {
      return 'INVALID_TYPE';
    }
  },
});
