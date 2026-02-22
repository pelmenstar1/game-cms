import { DefaultExport, FromEntries } from '@game-cms/shared';
import type { ObjectId } from 'mongodb';

export type ToClientType<T> = T extends ObjectId | Date
  ? string
  : T extends object
    ? {
        [K in keyof T]: ToClientType<T[K]>;
      }
    : T;

type IdArray = DefaultExport<{ id: PropertyKey }>[];

type IdArrayToEntries<T extends IdArray> = {
  [K in keyof T]: [T[K]['default']['id'], T[K]['default']];
}[number];

export type IdArrayToMap<T extends IdArray> = FromEntries<IdArrayToEntries<T>>;
