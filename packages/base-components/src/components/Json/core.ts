import { ComponentOutDataById, defineComponentCore } from '@game-cms/core';

import { Id, id } from './types.js';

export default defineComponentCore({
  id,
  defaultOutData: <Args>() => ({}) as ComponentOutDataById<Id, Args>,
});
