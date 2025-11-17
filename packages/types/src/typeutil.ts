import type { ObjectId } from 'mongodb';

export type ToClientType<T> = T extends ObjectId
  ? string
  : T extends object
    ? {
        [K in keyof T]: ToClientType<T[K]>;
      }
    : T;

export type DefaultExport<T = unknown> = { default: T };

type IdArray = DefaultExport<{ id: PropertyKey }>[];

type IdArrayToEntries<T extends IdArray> = {
  [K in keyof T]: [T[K]['default']['id'], T[K]['default']];
}[number];

export type FromEntries<T extends [PropertyKey, unknown]> = {
  [K in T[0]]: Extract<T, [K, unknown]>[1];
};

export type IdArrayToMap<T extends IdArray> = FromEntries<IdArrayToEntries<T>>;
