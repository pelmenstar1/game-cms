/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerComponentSchema } from '@game-cms/types';

export type ComposeInput = Record<string, ServerComponentSchema<any, any, any>>;

export type ComposeData<T extends ComposeInput = ComposeInput> = {
  [K in keyof T]: T[K] extends ServerComponentSchema<any, infer Data, any, any>
    ? Data
    : never;
};

export type ComposeOptions<T extends ComposeInput = ComposeInput> = {
  [K in keyof T]: T[K] extends ServerComponentSchema<
    infer Options,
    any,
    any,
    infer Id
  >
    ? {
        componentId: Id;
        options: Options;
      }
    : never;
};

export type ComposeError<T extends ComposeInput = ComposeInput> = {
  [K in keyof T]: T[K] extends ServerComponentSchema<any, any, infer Error, any>
    ? Error
    : never;
};
