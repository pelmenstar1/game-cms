import { expect, test } from 'vitest';

import { nameGenerator } from './nameGenerator.js';

test.each([
  ['abc', 'abc0'],
  ['abc%^', 'abc__0'],
  ['0ab', '_ab0'],
])('create', (input, expected) => {
  const actual = nameGenerator().create(input);

  expect(actual).toEqual(expected);
});

test('create repeating', () => {
  const generator = nameGenerator();
  const first = generator.create('abc');
  const second = generator.create('abc');

  expect(first).toEqual('abc0');
  expect(second).toEqual('abc1');
});
