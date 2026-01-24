import { expectTypeOf, test } from 'vitest';
import z from 'zod';

import { ConditionalData } from '../types.js';
import { unknownConditionalData } from './data.js';

test('unknownConditionalData', () => {
  type UnknownConditionalData = z.infer<typeof unknownConditionalData>;

  expectTypeOf<UnknownConditionalData>().toExtend<ConditionalData<unknown>>();
});
