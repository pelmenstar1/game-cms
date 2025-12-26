import { component } from '@game-cms/utils';

import meta from './meta.js';
import { validator } from './validator.js';

export default component({
  meta,
  config: {
    ui: {
      compact: true,
    },
  },
  validation: {
    data: validator,
  },
});
