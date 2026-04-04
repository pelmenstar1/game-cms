import { MaybePromise } from '@game-cms/shared';

export interface Test {
  name: string;
  fn: () => MaybePromise<void>;
}

export interface Suite {
  name: string;
  tests: Test[];
  beforeAlls: (() => MaybePromise<void>)[];
  children: Suite[];
}

const root: Suite = { name: '', tests: [], beforeAlls: [], children: [] };
let current = root;

export function getCurrentSuite(): Suite {
  return current;
}

export function setCurrentSuite(suite: Suite): void {
  current = suite;
}
