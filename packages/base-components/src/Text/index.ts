import { component } from '@game-cms/utils';
import z from 'zod';

import { id } from './meta.js';
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
    options: z.object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
    }),
  },
  default: {
    data: () => '',
    options: () => ({
      minLength: undefined,
      maxLength: undefined,
    }),
  },
});
