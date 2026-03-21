import type { DefaultExport, MaybePromise } from '@game-cms/shared';

import type { IdArrayToMap } from './typeutil.js';

export interface Service<Id extends string = string> {
  id: Id;
  lifecycle?: {
    onInit?: () => MaybePromise<void>;
  };
}

export interface ServiceMap {}

export type ResolveServices<T extends DefaultExport<Service>[]> =
  IdArrayToMap<T>;

/*@__NO_SIDE_EFFECTS__*/
export function service<const T extends Service>(value: T): T {
  return value;
}
