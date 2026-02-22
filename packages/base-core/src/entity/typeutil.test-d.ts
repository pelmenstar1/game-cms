import { expectTypeOf, test } from 'vitest';

import { EntityRegistryIds } from './typeutil.js';

test('EntityRegistryIds', () => {
  type Registry =
    typeof import('./test-setups/two-entities/entities/registry.js');
  type Actual = EntityRegistryIds<Registry>;

  expectTypeOf<Actual>().toEqualTypeOf<'base::test' | 'base::test2'>();
});
