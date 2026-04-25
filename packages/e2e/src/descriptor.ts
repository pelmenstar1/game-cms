import { MaybePromise } from '@game-cms/shared';

import {
  getCurrentFile,
  getCurrentSuite,
  LifecycleHook,
  setCurrentSuite,
  Suite,
} from './internal/suite.js';

export function describe(name: string, fn: () => void): void {
  const parent = getCurrentSuite();
  const file = parent.file ?? getCurrentFile();
  const suite: Suite = {
    name,
    file,
    tests: [],
    hooks: { beforeAll: [], afterAll: [] },
    children: [],
  };

  parent.children.push(suite);

  setCurrentSuite(suite);
  fn();
  setCurrentSuite(parent);
}

export function test(name: string, fn: () => MaybePromise<void>): void {
  getCurrentSuite().tests.push({ name, fn });
}

export const it = test;

export function beforeAll(fn: LifecycleHook): void {
  getCurrentSuite().hooks.beforeAll.push(fn);
}

export function afterAll(fn: LifecycleHook): void {
  getCurrentSuite().hooks.afterAll.push(fn);
}
