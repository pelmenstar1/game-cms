import { defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'base::file',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultOutData: () => [],
  validator: (data, options) => {
    if (!Array.isArray(data) || data.some((item) => typeof item !== 'string')) {
      return 'INVALID_TYPE';
    }

    if (options.minItems !== undefined && data.length < options.minItems) {
      return 'TOO_FEW_ITEMS';
    }

    if (options.maxItems !== undefined && data.length > options.maxItems) {
      return 'TOO_MANY_ITEMS';
    }
  },
});
