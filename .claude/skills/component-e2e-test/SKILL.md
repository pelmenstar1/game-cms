---
name: component-e2e-test
description: Create component data-flow e2e tests for game-cms components
argument-hint: <ComponentName> [<ComponentName2> ...]
---

## Writing component data-flow e2e tests

Parse `$ARGUMENTS` to extract one or more component names to create e2e tests for.

### Overview

E2e tests verify the full data roundtrip: `outData -> clientData -> outData/inData -> storageData -> outData`. They use the `componentDataFlowTests` helper from `@game-cms/component-testing-lib/e2e`.

Tests are discovered automatically by scanning for `**/*e2e-test.ts` files across the repo (excluding `node_modules` and `dist`). They run via `pnpm e2e:test` which starts a CMS instance with MongoDB and executes all discovered tests.

### File location

Place the test file at `<component-dir>/data.e2e-test.ts`, next to the component's `index.ts`.

- Base components: `packages/base-components/src/components/<Name>/data.e2e-test.ts`
- Game plugin components: `packages/game-plugin-components/src/components/<Name>/data.e2e-test.ts`

### Test patterns

There are two patterns depending on whether the test needs async setup.

#### Simple pattern (no setup needed)

For components whose test data can be constructed statically (text, number, dropdown, checkbox, compose, repeatable, dynamic-zone, alternative, graph, entity-reference):

```ts
import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { myComponent } from './index.js';

componentDataFlowTests('base::my-component', {
  outs: [
    { data: /* outData value */, component: myComponent(/* options */) },
  ],
});
```

#### Async setup pattern (needs beforeAll)

For components that need real data from CMS services before testing (file, font, or any component that references uploaded files or other runtime resources):

```ts
import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';
import { beforeAll, describe } from '@game-cms/e2e';
import { cms } from '@game-cms/global';

import { myComponent } from './index.js';

describe('MyComponent', () => {
  let someResource: SomeType;

  beforeAll(async () => {
    // Create resources via CMS services
    someResource = await cms().service('base::storage').uploadFile(/* ... */);
  });

  componentDataFlowTests('base::my-component', () => {
    return {
      outs: [
        { data: /* use someResource */, component: myComponent() },
      ],
    };
  });
});
```

When using the async pattern, pass a **factory function** `() => TestInput` instead of a plain object to `componentDataFlowTests`, so the test data is resolved after `beforeAll` runs.

### Writing test data (`outs`)

Each entry in `outs` is `{ data: ComponentOutDataById<Id>, component: ComponentSchema<Id> }`.

- `data` — a value matching the component's `outData` type
- `component` — the component schema created via its accessor function with appropriate options

Always include at least one entry with the **default/empty** data (e.g., `null`, `[]`, `{}`, `''`) and one with **populated** data.

Read the component's `types.ts` to understand the `outData` shape. Read `core.ts` for the `defaultOutData`. Read `controller.ts` to understand the storage transformer and any special handling.

### Container components

For components that wrap other components (compose, repeatable, alternative, dynamic-zone, graph), use simple inner components like `text()` or `number()` in test data:

```ts
import { number } from '../Number/index.js';
import { text } from '../Text/index.js';
import { graph } from './index.js';

componentDataFlowTests('base::graph', {
  outs: [
    { data: { nodes: {}, edges: [] }, component: graph({ component: text() }) },
    {
      data: {
        nodes: {
          n1: { value: '123', meta: { position: { x: 0, y: 0 } } },
        },
        edges: [],
      },
      component: graph({ component: text() }),
    },
  ],
});
```

### File-based components

Components that deal with files (file, font, spritesheet, etc.) need to upload a real file in `beforeAll`:

```ts
const file = await cms()
  .service('base::storage')
  .uploadFile({
    name: 'test.ext',
    mime: 'mime/type',
    content: Buffer.from('data'),
  });

const meta = await cms().service('base::storage').getInfo(file.id);
if (meta?.type !== StorageItemType.FILE) {
  throw new Error('Item should be file');
}
```

Import `StorageFileItemWithId` and `StorageItemType` from `@game-cms/base-core`.

### Steps

For each component name in `$ARGUMENTS`:

1. **Read** the component's `index.ts`, `types.ts`, `core.ts`, and `controller.ts` to understand:
   - The component ID (e.g., `'base::text'`)
   - The accessor function and its options
   - The `outData` type
   - The default data
   - Whether it wraps inner components
   - Whether it needs file uploads or other async setup

2. **Determine the pattern**: use the simple pattern unless the component needs async resources.

3. **Write** the test file at `<component-dir>/data.e2e-test.ts`.

4. **Verify** with `npx tsc --noEmit --project <package>/tsconfig.json` to catch type errors.
