import { describe, expect, test } from 'vitest';

import testEntity from './fixtures/two-entities/entities/test.js';
import test2Entity from './fixtures/two-entities/entities/test2.js';
import { getEntityEnvConfigSetup } from './utils.js';

describe('resolveEntitySchemas', () => {
  test('no schema registry', async () => {
    const actual = await getEntityEnvConfigSetup('no-entity-registry');

    expect(actual.schemaRegistry).toBeUndefined();
  });

  test('two entities', async () => {
    const actual = await getEntityEnvConfigSetup('two-entities');

    expect(actual).toMatchObject({
      schemaRegistry: {
        items: {
          test: { schema: testEntity },
          test2: { schema: test2Entity },
        },
      },
    });
  });
});
