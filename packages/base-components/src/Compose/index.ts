import { component } from '@game-cms/utils';

import meta from './meta.js';
import { ComposeData, ComposeError, ComposeOptions } from './types.js';
import { validator } from './validator.js';

export * from './types.js';

export default component<
  ComposeOptions,
  ComposeData,
  ComposeError,
  'base::compose'
>({
  meta,
  validation: {
    data: validator,
  },
});
