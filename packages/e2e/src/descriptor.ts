import { MaybePromise } from '@game-cms/shared';

import { getCurrentSuite, setCurrentSuite, Suite } from './internal/suite.js';

export function describe(name: string, fn: () => void): void {
  const suite: Suite = { name, tests: [], beforeAlls: [], children: [] };

  getCurrentSuite().children.push(suite);

  const parent = getCurrentSuite();

  setCurrentSuite(suite);
  fn();
  setCurrentSuite(parent);
}

export function test(name: string, fn: () => MaybePromise<void>): void {
  getCurrentSuite().tests.push({ name, fn });
}

export const it = test;

export function beforeAll(fn: () => MaybePromise<void>): void {
  getCurrentSuite().beforeAlls.push(fn);
}
