import { expectTypeOf, test } from 'vitest';

import { DataEntry, GetDataFromEntryArray } from './types.js';

test('GetDataFromEntryArray', () => {
  type Data = { foo: string };

  type EntryArray = [
    DataEntry<Data, 'key1'>,
    DataEntry<Data, 'key2'>,
    DataEntry<Data, 'key3'>,
  ];

  type Result = GetDataFromEntryArray<EntryArray, 'key1' | 'key2'>;

  // The expected type is the union of the data types for key1 and key2
  expectTypeOf<Result>().toEqualTypeOf<Data>();
});
