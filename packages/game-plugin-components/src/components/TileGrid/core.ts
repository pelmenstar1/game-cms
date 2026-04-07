import { defineComponentCore } from '@game-cms/core';

import { getDefaultData } from './shared.js';
import { id } from './types.js';

export default defineComponentCore({
  id,
  defaultOutData: getDefaultData,
});
