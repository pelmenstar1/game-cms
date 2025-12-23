import { component } from '@game-cms/utils';

import { id } from './meta.js';

export default component({
  id,
  validation: {
    data: () => '',
  },
  default: {
    data: () => 0,
  },
});
