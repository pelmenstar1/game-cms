import { defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'base::number',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultRawData: () => 0,
  validator: (value, options) => {
    if (typeof value !== 'number') {
      return 'INVALID_TYPE';
    }

    if (options.integer && !Number.isInteger(value)) {
      return 'EXPECTED_INTEGER';
    }

    if (options.min !== undefined && value < options.min) {
      return 'TOO_SMALL';
    }

    if (options.max !== undefined && value > options.max) {
      return 'TOO_LARGE';
    }
  },
});
