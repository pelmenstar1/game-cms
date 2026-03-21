import { describe, expectTypeOf, test } from 'vitest';

import { EntityRegistryIds } from './typeutil.js';

describe('two-entities', () => {
  type Registry =
    typeof import('./test-setups/two-entities/entities/registry.js');

  test('EntityRegistryIds', () => {
    type Actual = EntityRegistryIds<Registry>;

    expectTypeOf<Actual>().toEqualTypeOf<'base::test' | 'base::test2'>();
  });
});
