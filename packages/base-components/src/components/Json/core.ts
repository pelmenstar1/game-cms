import { ComponentOutDataById, defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'base::json',
  defaultOutData: <Args>() => ({}) as ComponentOutDataById<'base::json', Args>,
});
