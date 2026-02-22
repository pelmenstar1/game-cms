import { describe, expect, test } from 'vitest';

import testEntity from './fixtures/two-entities/entities/test.js';
import test2Entity from './fixtures/two-entities/entities/test2.js';
import { getEntityEnvConfigSetup } from './utils.js';

describe('resolveEntitySchemas', () => {
  test('two entities', async () => {
    const actual = await getEntityEnvConfigSetup('two-entities');

    expect(actual).toMatchObject({
      registry: {
        test: testEntity,
        test2: test2Entity,
      },
    });
  });
});
