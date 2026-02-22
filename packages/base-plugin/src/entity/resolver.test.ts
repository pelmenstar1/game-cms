import path from 'node:path';

import { PluginValueSourceContext } from '@game-cms/core';
import { describe, expect, test } from 'vitest';

import { resolveEntitySchemas } from './resolver.js';
import testEntity from './test-setups/two-entities/entities/test.js';
import test2Entity from './test-setups/two-entities/entities/test2.js';

describe('resolveEntitySchemas', () => {
  test('two entities', async () => {
    const actual = await resolveEntitySchemas({
      compiledFilePath: (name) =>
        path.join(import.meta.dirname, 'test-setups/two-entities', name),
    } as PluginValueSourceContext);

    expect(actual).toMatchObject({
      registry: {
        test: testEntity,
        test2: test2Entity,
      },
    });
  });
});
