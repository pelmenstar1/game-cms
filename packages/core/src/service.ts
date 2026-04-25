import type { GetPropertyOr, MaybePromise } from '@game-cms/shared';
import { MaybeArray } from '@game-cms/shared/collections';

type BaseServiceLifecycleHook = () => MaybePromise<void>;
export type ServiceLifecycleHook =
  | BaseServiceLifecycleHook
  | {
      dependsOn: MaybeArray<ServiceId>;
      action: BaseServiceLifecycleHook;
    };

export type ServiceLifecycle = {
  onInit?: ServiceLifecycleHook;
  onDestroy?: ServiceLifecycleHook;
};

export interface Service {
  lifecycle?: ServiceLifecycle;
}

export interface ServiceTypeMeta {
  // Expected shape:
  // id: string; -> should be equal to keyof ServiceTypeMap;
  //                It's a way to circumvent the limitation that Typescript doesn't allow the type to describe itself.
  //                Otherwise we wouldn't be able to reference service ids inside services.
}

export interface ServiceTypeMap {}

export type ServiceId = GetPropertyOr<ServiceTypeMeta, 'id', string>;

export type ServiceById<K extends ServiceId> = GetPropertyOr<
  ServiceTypeMap,
  K,
  never
>;

export type ServiceMap<K extends string = ServiceId> = {
  [P in K]: ServiceById<P>;
};

/*@__NO_SIDE_EFFECTS__*/
export function service<T extends Service>(value: T): T {
  return value;
}
