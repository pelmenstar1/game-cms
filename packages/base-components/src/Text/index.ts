import { component } from '@game-cms/utils';
import z from 'zod';

import { id } from './meta.js';

export default component({
  id,
  config: {
    ui: {
      compact: true,
    },
  },
  validation: {
    data: z.string(),
    options: z.object(),
  },
  default: {
    data: () => '',
    options: () => ({}),
  },
});
