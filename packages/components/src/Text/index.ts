import { component } from '@game-cms/shared-api';
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
