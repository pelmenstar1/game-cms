import { describe, expect, test } from 'vitest';

import { tokenize } from './tokenizer.js';

describe('tokenize', () => {
  test('empty string -> empty set', () => {
    expect(tokenize('')).toEqual(new Set());
  });

  test('plain words are lowercased', () => {
    expect(tokenize('Hello World')).toEqual(new Set(['hello', 'world']));
  });

  test('non-word separators are stripped', () => {
    expect(tokenize('foo-bar_baz')).toEqual(new Set(['foo', 'bar', 'baz']));
  });

  describe('camelCase splitting', () => {
    test.each<[string, string[]]>([
      ['heroName', ['heroname', 'hero', 'name']],
      ['playerHealth', ['playerhealth', 'player', 'health']],
      ['HTMLParser', ['htmlparser', 'html', 'parser']],
      ['myHTMLDoc', ['myhtmldoc', 'my', 'html', 'doc']],
    ])('%s', (input, expected) => {
      expect(tokenize(input)).toEqual(new Set(expected));
    });
  });

  describe('digit boundary splitting', () => {
    test.each<[string, string[]]>([
      ['zone3', ['zone3', 'zone', '3']],
      ['weapon2a', ['weapon2a', 'weapon', '2', 'a']],
      ['mp3', ['mp3', 'mp', '3']],
    ])('%s', (input, expected) => {
      expect(tokenize(input)).toEqual(new Set(expected));
    });
  });

  test('no sub-tokens added for plain single word', () => {
    expect(tokenize('hello')).toEqual(new Set(['hello']));
  });

  test('deduplicates tokens', () => {
    expect(tokenize('foo foo')).toEqual(new Set(['foo']));
  });
});
