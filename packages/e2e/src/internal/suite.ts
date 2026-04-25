import { MaybePromise } from '@game-cms/shared';

export interface Test {
  name: string;
  fn: () => MaybePromise<void>;
}

export type LifecycleHook = () => MaybePromise<void>;

export interface Suite {
  name: string;
  file?: string;
  tests: Test[];
  children: Suite[];
  hooks: {
    beforeAll: LifecycleHook[];
    afterAll: LifecycleHook[];
  };
}

const root: Suite = {
  name: '',
  tests: [],
  hooks: { beforeAll: [], afterAll: [] },
  children: [],
};

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
