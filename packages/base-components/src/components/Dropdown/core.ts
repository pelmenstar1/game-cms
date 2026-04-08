import { defineComponentCore } from '@game-cms/core';

import { id } from './types.js';

export default defineComponentCore({
  id,
  defaultOutData: ({ items }) => items[0].key,
});
