import { defineComponentCore } from '../../../component/core.js';

export default defineComponentCore({
  id: 'test-core',
  defaultOutData: 0 as never,
  validator: (data) => typeof data === 'number',
});
