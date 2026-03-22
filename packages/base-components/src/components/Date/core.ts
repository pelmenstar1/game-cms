import { defineComponentCore } from '@game-cms/core';

import { getDefaultData } from './internal/defaultData.js';

export default defineComponentCore({
  id: 'base::date',
  defaultOutData: (options) => getDefaultData(options).toString(),
});
