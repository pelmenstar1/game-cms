import type { ComponentEntry } from '@game-cms/core';
import type { ZodType } from 'zod';

export const id = 'base::json';
export type Id = typeof id;

type JsonArgs = { allowEmpty: boolean; type: unknown };

type ResolveArgs<T> = T extends JsonArgs ? T : JsonArgs;

type NullIfEmpty<T, Args> = Args extends { allowEmpty: true } ? T | null : T;

type JsonEntry<Args extends JsonArgs> = {
  outData: NullIfEmpty<Args['type'], Args>;
  options: {
    type?: ZodType<Args['type']>;
    allowEmpty?: Args['allowEmpty'];
  };
  error: 'INVALID_FORMAT';
  clientData: string;
  searchIndexData: string[];
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<JsonEntry<ResolveArgs<Args>>>;
  }
}
