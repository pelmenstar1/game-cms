import { componentCore } from '@game-cms/core';

export default componentCore({
  id: 'base::text',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultRawData: () => '',
  validator: (text, options) => {
    if (typeof text !== 'string') {
      return 'INVALID_TYPE';
    }

    const { minLength, maxLength } = options;

    if (minLength !== undefined && text.length < minLength) {
      return 'TEXT_TOO_SHORT';
    }

    if (maxLength !== undefined && text.length > maxLength) {
      return 'TEXT_TOO_LONG';
    }
  },
});
