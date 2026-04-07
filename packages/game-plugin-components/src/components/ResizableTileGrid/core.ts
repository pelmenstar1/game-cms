import { defineComponentCore } from '@game-cms/core';

import { id } from './types.js';

export default defineComponentCore({
  id,
  defaultOutData: () => ({ width: 1, height: 1, grid: [0] }),
});
