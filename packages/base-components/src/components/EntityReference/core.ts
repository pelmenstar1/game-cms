import { defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'base::entity-reference',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultOutData: () => null,
  validator: (data) => {
    if (typeof data !== 'string') {
      return 'INVALID_TYPE';
    }
  },
});
