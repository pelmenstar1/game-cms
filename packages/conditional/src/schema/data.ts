import z from 'zod';

import { conditionalAstExpression } from './ast.js';

export const unknownConditionalData = z.object({
  default: z.unknown(),
  alternative: z.array(
    z.object({
      condition: conditionalAstExpression,
      value: z.unknown(),
    })
  ),
});
