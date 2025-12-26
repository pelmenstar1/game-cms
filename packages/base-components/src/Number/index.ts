import { component } from '@game-cms/utils';

import meta from './meta.js';
import { validator } from './validator.js';

export default component({
  meta,
  validation: {
    data: validator,
  },
});
