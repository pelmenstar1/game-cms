import { defineComponentCore } from '@game-cms/core';

import { getDefaultData } from './internal/defaultData.js';
import { id } from './types.js';

export default defineComponentCore({
  id,
  defaultOutData: (options) => getDefaultData(options).toString(),
});
