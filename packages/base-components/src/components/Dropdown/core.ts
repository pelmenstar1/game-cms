import { componentCore } from '@game-cms/core';

export default componentCore({
  id: 'base::dropdown',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultRawData: ({ items }) => items[0].key,
  validator: (data, { items }) => {
    if (!items.some(({ key }) => data === key)) {
      return 'INVALID_TYPE';
    }
  },
});
