import { componentCore } from '@game-cms/core';

export default componentCore({
  id: 'base::json',
  defaultRawData: () => ({}),
  validator: () => undefined,
});
