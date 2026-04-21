---
name: unit-test
description: Create unit tests for modules in the game-cms monorepo
argument-hint: <file-path> [<file-path2> ...]
---

## Writing unit tests

Parse `$ARGUMENTS` to extract one or more file paths (or module names) to create unit tests for.

If `$ARGUMENTS` is empty, use the currently active file from the IDE context (the file the user has open or most recently viewed). In this case, only write tests for the **primary exported function** (the one most likely to be the module's main export — e.g., the only export, the default export, or the function that matches the file name).

### Overview

Unit tests verify individual functions and modules in isolation. They use **Vitest** as the test framework and run via `pnpm test` (which executes `vitest run --project unit`).

Tests are discovered automatically by scanning for `**/*.test.ts` files across the repo. The Vitest config defines the `unit` project with `environment: 'node'`.

### File location

Place the test file **co-located** next to the source file:

- `packages/<pkg>/src/module.ts` → `packages/<pkg>/src/module.test.ts`
- `packages/<pkg>/src/utils/helper.ts` → `packages/<pkg>/src/utils/helper.test.ts`

For complex modules with fixtures, use a `__tests__` directory:

- `packages/<pkg>/src/entity/connector.ts` → `packages/<pkg>/src/entity/__tests__/connector.test.ts`

### Imports

Always import from `vitest` and use `.js` extensions for local imports (ESM):

```ts
import { describe, expect, test } from 'vitest';

import { myFunction } from './myModule.js';
```

When writing multiple tests, always group them inside a `describe` block named after the function or module under test. Never encode grouping via slashes in test names (e.g. `'myFn/error'`) — use nested `describe` blocks instead. Exception: a single standalone test case does not need a `describe` wrapper.

### Test patterns

#### Simple function tests

For pure functions with a few cases, use flat `test` calls:

```ts
import { expect, test } from 'vitest';

import { hashPassword, verifyPassword } from './password.js';

test('smoke', async () => {
  const result = await hashPassword('123');
  const actual = await verifyPassword(result, '123');
  expect(actual).toEqual(true);
});
```

#### Parametrized tests with `test.each`

For functions with many input/output pairs, use `test.each` inside a `describe` block:

```ts
import { describe, expect, test } from 'vitest';

import { parseConditionalNotation } from './parser.js';

describe('parseConditionalNotation', () => {
  test.each<[string, ExpectedType]>([
    ['input1', expectedOutput1],
    ['input2', expectedOutput2],
  ])('success', (input, expected) => {
    const actual = parseConditionalNotation(input);
    expect(actual).toEqual(expected);
  });

  test.each<[string]>([['bad-input-1'], ['bad-input-2']])('error', (input) => {
    expect(() => parseConditionalNotation(input)).toThrow();
  });
});
```

#### Grouped tests with `describe`

For modules with multiple behaviors to test:

```ts
import { describe, expect, it } from 'vitest';

import { formatSearchParams } from './searchParams.js';

describe('formatSearchParams', () => {
  it('should format various types', () => {
    expect(formatSearchParams({ str: 'value', num: 123 })).toBe(
      'str=value&num=123'
    );
  });

  it('should handle empty object', () => {
    expect(formatSearchParams({})).toBe('');
  });
});
```

#### Async error testing

For functions that return promises and may reject:

```ts
await expect(handleResponseError(response)).rejects.toThrow('error message');

await expect(handleResponseError(response)).rejects.toMatchObject({
  message: 'Not found',
  httpCode: 404,
});
```

#### Helper functions

Define helper functions inside the test file to reduce repetitive setup:

```ts
function createMockResponse(status: number, body: string | null): Response {
  return new Response(body, { status });
}
```

#### Fastify request testing

For testing code that depends on Fastify request objects, use the `makeRequest` helper from `@game-cms/testing-lib`:

```ts
import {
  makeRequest,
  type MakeRequestInjectOptions,
} from '@game-cms/testing-lib';

function helperViaFastify(options: MakeRequestInjectOptions) {
  return makeRequest({
    inject: options,
    factory: (req) => myFunction(req),
  });
}
```

For testing Fastify routes/plugins directly, create a real Fastify instance:

```ts
import { fastify } from 'fastify';

const app = fastify({ logger: false });
// register plugins, routes, etc.
const res = await app.inject({ method: 'POST', path: '/', payload: { ... } });
expect(res.statusCode).toBe(200);
```

### Assertion style guide

Use Vitest's built-in assertions (no external libraries):

- `expect(x).toBe(y)` — strict equality for primitives
- `expect(x).toEqual(y)` — deep equality for objects/arrays
- `expect(x).toMatchObject(partial)` — partial object matching
- `expect(x).toHaveProperty('key')` — property existence
- `expect(x).toBeUndefined()` / `toBeNull()` / `toBeTruthy()` / `toBeFalsy()`
- `expect(x).toThrow()` / `toThrow('message')` — sync exceptions
- `expect(x).rejects.toThrow()` — async rejections
- `expect.arrayContaining([...])` — partial array matching
- `expect.any(String)` — type matching within `toMatchObject`

### Mocking guidelines

- **Prefer real instances over mocks.** Use actual Fastify apps, real data structures, etc.
- For unavoidable mocks, use direct property overrides rather than Vitest's `vi.fn()` when possible
- Use fixture directories (`__tests__/fixtures/`) for complex test data
- When the mocked value is a file path, use Unix style paths (`/path/to/file`) for consistency, even on Windows
- In test names and labels, use `->` (ASCII arrow) for symbols, not `→` (Unicode arrow)

### Steps

If `$ARGUMENTS` is empty, identify the active IDE file from the conversation context (look for `ide_opened_file` or `ide_selection` tags). Use that file path as the sole target, and scope the tests to the primary exported function only.

For each file path in `$ARGUMENTS` (or the single active file when no arguments are given):

1. **Read** the source file to understand:
   - All exported functions/classes and their signatures
   - Input/output types
   - Edge cases (null, undefined, empty, error conditions)
   - Dependencies (are they pure functions or do they need setup?)

2. **Determine the test style:**
   - Multiple test cases → wrap in `describe` named after the function; use `test.each` for parametrized inputs
   - Module with distinct behaviors → `describe` + nested `describe`/`test` groups
   - Single test case → flat `test` call, no `describe` wrapper needed
   - Needs Fastify request → use `@game-cms/testing-lib`

3. **Write** the test file at the co-located path (`<source>.test.ts`).

4. **Include test cases for:**
   - Happy path with typical inputs
   - Default/empty values (null, undefined, empty string, empty array/object)
   - Edge cases specific to the function's logic
   - Error conditions (invalid inputs, thrown exceptions)
