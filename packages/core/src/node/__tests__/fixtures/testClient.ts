import { defineComponentClientController } from '../../../component/client.js';

export default defineComponentClientController({
  core: {
    id: 'test-core',
    defaultOutData: 0 as never,
  },
  validator: (data) => typeof data === 'number',
});
