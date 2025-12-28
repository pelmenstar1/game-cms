/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerComponentSchema } from '@game-cms/types';

export type ComposeInput = Record<string, ServerComponentSchema<any, any, any>>;

type GetSchemaParams<T> =
  T extends ServerComponentSchema<
    infer Options,
    infer Data,
    infer Error,
    infer Id,
    infer ResolvedData,
    infer ClientData
  >
    ? {
        options: Options;
        data: Data;
        error: Error;
        id: Id;
        resolvedData: ResolvedData;
        clientData: ClientData;
      }
    : never;

export type ComposeData<T extends ComposeInput = ComposeInput> = {
  [K in keyof T]: GetSchemaParams<T[K]>['data'];
};

export type ComposeClientData<T extends ComposeInput = ComposeInput> = {
  [K in keyof T]: GetSchemaParams<T[K]>['clientData'];
};

export type ComposeResolvedData<T extends ComposeInput = ComposeInput> = {
  [K in keyof T]: GetSchemaParams<T[K]>['resolvedData'];
};

export type ComposeOptions<T extends ComposeInput = ComposeInput> = {
  [K in keyof T]: {
    componentId: GetSchemaParams<T[K]>['id'];
    options: GetSchemaParams<T[K]>['options'];
  };
};

export type ComposeError<T extends ComposeInput = ComposeInput> = {
  [K in keyof T]: GetSchemaParams<T[K]>['error'];
};
