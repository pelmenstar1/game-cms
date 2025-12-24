import { component } from '@game-cms/utils';

import { defaultData, id } from './meta.js';

export default component({
  id,
  validation: {
    data: () => '',
  },
  default: {
    data: defaultData,
  },
});
