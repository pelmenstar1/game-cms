import { ObjectId } from 'mongodb';
import { expectTypeOf, test } from 'vitest';

import type { ToClientType } from './typeutil.js';

test('ToClientType', () => {
  expectTypeOf<ToClientType<string>>().toExtend<string>();
  expectTypeOf<ToClientType<ObjectId>>().toExtend<string>();
  expectTypeOf<ToClientType<Date>>().toExtend<string>();
  expectTypeOf<ToClientType<Date[]>>().toExtend<string[]>();
  expectTypeOf<ToClientType<{ abc: { b: ObjectId[] } }>>().toExtend<{
    abc: { b: string[] };
  }>();
});
