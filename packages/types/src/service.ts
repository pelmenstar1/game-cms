import type { MaybePromise } from '@game-cms/shared';

export interface Service<Id extends string = string> {
  id: Id;

  init?: () => MaybePromise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GameCmsServiceMap {}

type ServiceImport = { default: Service };

type ServiceTupleToUnion<T extends ServiceImport[]> = {
  [K in keyof T]: [T[K]['default']['id'], T[K]['default']];
}[number];

type ResolveIds<T extends [string, unknown]> = {
  [K in T[0]]: Extract<T, [K, unknown]>[1];
};

export type ResolveServices<T extends ServiceImport[]> = ResolveIds<
  ServiceTupleToUnion<T>
>;
