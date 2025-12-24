import { component } from '@game-cms/utils';

import { defaultData, id } from './meta.js';
import { validator } from './validator.js';

export default component({
  id,
  config: {
    ui: {
      compact: true,
    },
  },
  validation: {
    data: validator,
  },
  default: {
    data: defaultData,
  },
});
