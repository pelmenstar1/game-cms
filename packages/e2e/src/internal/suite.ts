import { MaybePromise } from '@game-cms/shared';

export interface Test {
  name: string;
  fn: () => MaybePromise<void>;
}

export interface Suite {
  name: string;
  file?: string;
  tests: Test[];
  beforeAlls: (() => MaybePromise<void>)[];
  children: Suite[];
}

const root: Suite = { name: '', tests: [], beforeAlls: [], children: [] };

let current = root;
let currentFile: string | undefined;

export function getCurrentSuite(): Suite {
  return current;
}

export function setCurrentSuite(suite: Suite): void {
  current = suite;
}

export function getCurrentFile(): string | undefined {
  return currentFile;
}

export function setCurrentFile(file: string): void {
  currentFile = file;
}
