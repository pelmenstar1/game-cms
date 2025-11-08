import type { ObjectId } from 'mongodb';

export type ToClientType<T> = T extends ObjectId
  ? string
  : T extends object
    ? {
        [K in keyof T]: ToClientType<T[K]>;
      }
    : T;
