import { expectTypeOf, test } from 'vitest';

import { Plugin } from './plugin.js';

test('Plugin env', () => {
  expectTypeOf<Plugin>().toExtend<{ env?: unknown }>();
  expectTypeOf<Plugin<{ env: { custom: string } }>>().toExtend<{
    env: unknown;
  }>();
});
