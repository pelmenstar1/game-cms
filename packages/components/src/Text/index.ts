import z from 'zod';

import { defineComponent } from '../index.js';

export default defineComponent({
  id: 'base::test',
  defaultData: () => [],
  defaultOptions: () => [],
  validation: {
    data: z.tuple([]),
    options: z.tuple([]),
  },
  isValid: () => true,
});
