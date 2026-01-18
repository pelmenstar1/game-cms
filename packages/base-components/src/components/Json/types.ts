import type { ComponentEntry } from '@game-cms/core';
import type { ZodType } from 'zod';

type JsonArgs = { allowEmpty: boolean; type: unknown };

type ResolveArgs<T> = T extends JsonArgs ? T : JsonArgs;

type NullIfEmpty<T, Args> = Args extends { allowEmpty: true } ? T | null : T;

type JsonEntry<Args extends JsonArgs> = {
  rawData: NullIfEmpty<Args['type'], Args>;
  options: {
    type?: ZodType<Args['type']>;
    allowEmpty?: Args['allowEmpty'];
  };
  error: 'INVALID_FORMAT';
  clientData: string;
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::json': ComponentEntry<JsonEntry<ResolveArgs<_Args>>>;
  }
}
