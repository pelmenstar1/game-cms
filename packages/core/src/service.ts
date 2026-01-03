import type { MaybePromise } from '@game-cms/shared';

import type { DefaultExport, IdArrayToMap } from './typeutil.js';

export interface Service<Id extends string = string> {
  id: Id;

  init?: () => MaybePromise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ServiceMap {}

export type ResolveServices<T extends DefaultExport<Service>[]> =
  IdArrayToMap<T>;

/*@__NO_SIDE_EFFECTS__*/
export function service<const T extends Service>(value: T): T {
  return value;
}
