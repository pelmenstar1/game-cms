import { component } from '@game-cms/utils';
import z from 'zod';

import { id } from './meta.js';

export default component({
  id,
  validation: {
    data: () => '',
    options: z.object(),
  },
  default: {
    data: () => 0,
    options: () => ({}),
  },
});
