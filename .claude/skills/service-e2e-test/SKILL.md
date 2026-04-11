---
name: service-e2e-test
description: Create service e2e tests for base-api services in the game-cms monorepo
argument-hint: <ServiceName> [<ServiceName2> ...]
---

## Writing service e2e tests

Parse `$ARGUMENTS` to extract one or more service names to create e2e tests for.

### Overview

Service e2e tests verify that a service's public methods behave correctly against a real CMS instance (MongoDB + full service graph). They use helpers from `@game-cms/e2e` and access services via `cms().service('base::service-name')`.

Tests are discovered automatically by scanning for `**/*e2e-test.ts` files across the repo. They run via `pnpm e2e:test`.

### File location

Place the test file co-located next to the service source file:

- `packages/base-api/src/services/<serviceName>.e2e-test.ts`

### Imports

Always import test primitives from `@game-cms/e2e`, not Vitest:

```ts
import { describe, expect, it } from '@game-cms/e2e';
import { cms } from '@game-cms/global';
```

Also import `env` when the test needs admin credentials or config:

```ts
import { env } from '@game-cms/global';
```

Import domain types from their respective packages as needed:

```ts
import { ApiError, type ApiRouteId } from '@game-cms/core/api';
import type { CreateUserPayload } from '@game-cms/base-core';
import { ObjectId } from 'mongodb';
```

### Service access

Always access services via `cms().service(id)`. Prefer extracting repeated calls into a local helper:

```ts
function service() {
  return cms().service('base::user');
}
```

For multi-service tests, access each service inline at the top of each `it` block.

### Test structure

One `describe` block per service method. Use `it` (alias for `test`) for each case:

```ts
describe('create', () => {
  it('should create a new record successfully', async () => { ... });
  it('should throw error on duplicate', async () => { ... });
});

describe('getById', () => {
  it('should retrieve a record by id', async () => { ... });
  it('should return null for non-existent id', async () => { ... });
});
```

Always test both the happy path and the error path for each method.

### Resource cleanup

**Prefer `await using` with `Symbol.asyncDispose`** for automatic cleanup. Extract a temporal resource factory:

```ts
async function createTemporalUser(payload: CreateUserPayload) {
  const result = await service().create(payload);

  return {
    result,
    [Symbol.asyncDispose]: async () => {
      await service().delete(result.id);
    },
  };
}

// Usage:
await using u = await createTemporalUser({
  email,
  password,
  displayName,
  permissions,
});
const user = await service().getById(u.result.id);
```

Use `_` for the variable name when the resource itself is not needed after creation:

```ts
await using _ = await createTemporalUser({ ... });
```

When `await using` is not applicable (e.g., in a test that explicitly tests deletion), clean up manually at the end of the test:

```ts
const { id } = await service().create({ ... });
await service().delete(id);
const record = await service().getById(id);
expect(record).toBeNull();
```

### Flow tests

For simple CRUD services, a single `test('... flow', ...)` that runs create → read → delete sequentially is often clearer than separate `describe` blocks:

```ts
test('token flow', async () => {
  const { id, token } = await service.create({
    name,
    permissions,
    expirationTime: 100,
  });

  const byToken = await service.getByToken(token);
  expect(byToken).toMatchObject({ name, permissions, _id: id });

  const byId = await service.getById(id);
  expect(byId).toMatchObject({ name, permissions, _id: id });

  await service.deleteById(id);

  const afterDelete = await service.getById(id);
  expect(afterDelete).toBeNull();
});
```

Use this pattern when the service has fewer than ~4 public methods or when operations are tightly coupled.

### Admin / env config

Use `env().config.auth.admin` to get pre-seeded admin credentials when tests need wildcard-permission sessions:

```ts
const { email, password } = env().config.auth.admin;
const { session } = await authService.signUserIn({ email, password });
```

### Error assertions

For `ApiError` throws use:

```ts
await expect(service.doSomething(badInput)).rejects.toThrow(ApiError);
```

For unspecified error types:

```ts
await expect(service.doSomething(badInput)).rejects.toThrow();
```

### Assertion style guide

- `expect(x).toBeDefined()` — non-null/undefined result
- `expect(x).toBeGreaterThan(0)` — numeric validity (e.g., expiration times)
- `expect(x).toMatchObject(partial)` — partial object matching
- `expect(x).toBeNull()` — absence after delete
- `expect(x).toBe(true/false)` — boolean results
- `expect(x).toEqual(y)` — deep equality for arrays/objects
- `expect(new Set(x)).toEqual(new Set(y))` — unordered set equality for permission arrays
- `expect([...set].every(fn)).toBe(true)` — invariant over a set

### Steps

For each service name in `$ARGUMENTS`:

1. **Read** the service source file (`packages/base-api/src/services/<name>.ts`) to understand:
   - The service id used in `cms().service(...)` (e.g., `'base::auth'`)
   - All exported methods and their signatures
   - Which methods interact with other services (dependencies to set up in tests)
   - Which methods throw `ApiError` and under what conditions
   - Return types (JwtResult, null, boolean, paginated list, etc.)

2. **Determine the test structure:**
   - Fewer than ~4 methods with tight coupling → single flow `test`
   - Multiple independent methods → one `describe` per method
   - Methods that create resources → use `await using` temporal helper
   - Methods that need admin session → use `env().config.auth.admin`

3. **Write** the test file at `packages/base-api/src/services/<name>.e2e-test.ts`.

4. **Include test cases for each method:**
   - Happy path with valid inputs
   - Null / not-found return (`toBeNull()`)
   - Error path throwing `ApiError` (invalid input, duplicates, permission denied, expired tokens)

5. **Verify** with `npx tsc --noEmit --project packages/base-api/tsconfig.json` to catch type errors.
