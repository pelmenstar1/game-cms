import { expect, test } from 'vitest';

import { parseErrorStack } from './error.js';

function makeError(stack: string | undefined): Error {
  const error = new Error('test');
  Object.defineProperty(error, 'stack', { value: stack });
  return error;
}

test('parseErrorStack returns empty array when stack is undefined', () => {
  expect(parseErrorStack(makeError(undefined))).toEqual([]);
});

test('parseErrorStack returns empty array for empty stack', () => {
  expect(parseErrorStack(makeError(''))).toEqual([]);
});

test('parseErrorStack parses V8 frames with function name', () => {
  const stack = [
    'Error: boom',
    '    at foo (/a/b.js:10:5)',
    '    at Object.bar (/a/c.js:2:1)',
  ].join('\n');

  expect(parseErrorStack(makeError(stack))).toEqual([
    { function: 'foo', file: '/a/b.js', line: 10, column: 5 },
    { function: 'Object.bar', file: '/a/c.js', line: 2, column: 1 },
  ]);
});

test('parseErrorStack parses V8 anonymous frames', () => {
  const stack = ['Error: boom', '    at /a/b.js:10:5'].join('\n');

  expect(parseErrorStack(makeError(stack))).toEqual([
    { function: undefined, file: '/a/b.js', line: 10, column: 5 },
  ]);
});

test('parseErrorStack parses SpiderMonkey/Safari frames', () => {
  const stack = ['foo@/a/b.js:10:5', '@/a/c.js:2:1'].join('\n');

  expect(parseErrorStack(makeError(stack))).toEqual([
    { function: 'foo', file: '/a/b.js', line: 10, column: 5 },
    { function: undefined, file: '/a/c.js', line: 2, column: 1 },
  ]);
});

test('parseErrorStack skips lines that do not match any format', () => {
  const stack = [
    'Error: boom',
    'some random text',
    '    at foo (/a/b.js:10:5)',
    '',
  ].join('\n');

  expect(parseErrorStack(makeError(stack))).toEqual([
    { function: 'foo', file: '/a/b.js', line: 10, column: 5 },
  ]);
});

test('parseErrorStack handles Windows-style paths', () => {
  const stack = 'Error: boom\n    at foo (C:\\a\\b.js:10:5)';

  expect(parseErrorStack(makeError(stack))).toEqual([
    { function: 'foo', file: String.raw`C:\a\b.js`, line: 10, column: 5 },
  ]);
});

function throwInner(): never {
  throw new Error('boom');
}

test('parseErrorStack parses a real thrown error', () => {
  const caught = ((): Error => {
    try {
      throwInner();
    } catch (error) {
      return error as Error;
    }
  })();

  const frames = parseErrorStack(caught);

  expect(frames.length).toBeGreaterThan(0);
  expect(frames[0].function).toContain('throwInner');
  expect(frames[0].file).toContain('error.test');
  expect(frames[0].line).toBeGreaterThan(0);
  expect(frames[0].column).toBeGreaterThan(0);
});
