import {
  ComponentRawInDataById,
  ComponentRawInDataByIdPath,
  GetComponentSchemaArgs,
  ParseComponentNestedPath,
} from '@game-cms/core';
import { describe, expectTypeOf, test } from 'vitest';

import { compose } from '../Compose/index.js';
import { text } from '../Text/index.js';
import { dynamicZone, dynamicZoneEntry } from './index.js';

type Id = 'base::dynamic-zone';

describe('DynamicZone', () => {
  test('nested path type', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const schema = dynamicZone({
      options: {
        option1: dynamicZoneEntry({
          option: { title: 'Option 1' },
          component: text(),
        }),
        option2: dynamicZoneEntry({
          option: { title: 'Option 2' },
          component: compose({
            field: text(),
          }),
        }),
      },
    });

    type Args = GetComponentSchemaArgs<typeof schema>;
    type Result = ComponentRawInDataByIdPath<Id, Args>;

    expectTypeOf<Result>().toEqualTypeOf<
      '[option1]' | '[option2]' | '[option2].field'
    >();
  });
});

describe('ParseComponentNestedPath', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schema = dynamicZone({
    options: {
      option1: dynamicZoneEntry({
        option: { title: 'Option 1' },
        component: compose({
          abc: text(),
        }),
      }),
    },
  });
  type Args = GetComponentSchemaArgs<typeof schema>;
  type Data = ComponentRawInDataById<Id, Args>;

  test('transition current', () => {
    type Actual = ParseComponentNestedPath<Data, '[option1]', Id, Args>;

    expectTypeOf<Actual>().toEqualTypeOf<{ readonly abc: string }>();
  });

  test('transition next', () => {
    type Actual = ParseComponentNestedPath<Data, '[option1].abc', Id, Args>;

    expectTypeOf<Actual>().toEqualTypeOf<string>();
  });
});
