import type { MaybePromise } from './utils.js';

export interface Service<Id extends string = string> {
  id: Id;

  init?: () => MaybePromise<void>;
}
