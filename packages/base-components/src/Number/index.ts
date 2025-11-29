import { component } from '@game-cms/utils';
import z from 'zod';

export default component({
  id: 'base::number',
  validation: {
    data: z.number(),
    options: z.object(),
  },
  default: {
    data: () => 0,
    options: () => ({}),
  },
});
