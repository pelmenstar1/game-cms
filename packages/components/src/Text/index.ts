import { component } from '@game-cms/utils';
import z from 'zod';

export default component({
  id: 'base::text',
  validation: {
    data: z.string(),
    options: z.object(),
  },
  default: {
    data: () => '',
    options: () => ({}),
  },
});
