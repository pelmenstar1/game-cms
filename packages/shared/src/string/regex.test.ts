import { describe, expect, test } from 'vitest';

import { emailRegex, urlRegex } from './regex.js';

describe('url', () => {
  test.each<[string]>([
    ['http://google.com/'],
    ['https://google.com/'],
    ['http://google.com/a/b/c'],
  ])('match', (input) => {
    const actual = urlRegex.test(input);

    expect(actual).toEqual(true);
  });

  test.each<[string]>([['www.google'], ['google']])('no match', (input) => {
    const actual = urlRegex.test(input);

    expect(actual).toEqual(false);
  });
});

describe('email', () => {
  test.each<[string]>([
    ['simple@example.com'],
    ['very.common@example.com'],
    ['FirstName.LastName@EasierReading.org'],
    ['x@example.com'],
    ['long.email-address-with-hyphens@and.subdomains.example.com'],
    ['name/surname@example.com'],
    ['admin@example'],
    ['example@s.example'],
    ['mailhost!username@example.org'],
  ])('match', (input) => {
    const actual = emailRegex.test(input);

    expect(actual).toBe(true);
  });

  test.each<[string]>([
    ['abc.example.com'],
    ['abc@example.com   '],
    ['   abc@example.com   '],
    ['a@b@c@example.com'],
    [String.raw`a"b(c)d,e:f;g<h>i[j\k]l@example.com`],
    ['just"not"right@example.com'],
  ])('no match', (input) => {
    const actual = emailRegex.test(input);

    expect(actual).toBe(false);
  });
});
