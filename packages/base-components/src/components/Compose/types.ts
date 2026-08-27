import {
  ComponentClientOptionsById,
  ComponentEntry,
  ComponentNestedPathShape,
  ComponentSchema,
  ComponentSchemaNestedPathDetails,
  GetComponentSchemaTypes,
} from '@game-cms/core';

import { NestedPathDot } from '../../internal/nestedPath.js';

export const id = 'base::compose' as const;
export type Id = typeof id;

export type ComposeInput = Record<string, ComponentSchema>;

export type ResolveComposeInput<T> = T extends ComposeInput ? T : ComposeInput;

type ComposeMap<
  Input extends ComposeInput,
  TK extends keyof GetComponentSchemaTypes,
> = {
  [K in keyof Input]: GetComponentSchemaTypes<Input[K]>[TK];
};

export type ComposeOptionsEntry<T extends ComponentSchema = ComponentSchema> =
  Pick<T, 'componentId' | 'options'>;

export type ComposeEntry<Args> = BaseComposeEntry<ResolveComposeInput<Args>>;

type BaseComposeEntry<Input extends ComposeInput> = {
  options: {
    [K in keyof Input]: ComposeOptionsEntry<Input[K]>;
  };
  clientOptions: {
    [K in keyof Input]: Input[K] extends ComponentSchema<infer Id, infer Args>
      ? {
          componentId: Id;
          options: ComponentClientOptionsById<Id, Args>;
        }
      : ComposeOptionsEntry;
  };
  error: {
    ownError?: 'INVALID_TYPE';
    properties?: {
      [K in keyof Input]:
        GetComponentSchemaTypes<Input[K]>['error'] | undefined;
    };
  };
  outData: ComposeMap<Input, 'outData'>;
  inData: ComposeMap<Input, 'inData'>;
  partialInData: Partial<ComposeMap<Input, 'partialInData'>>;
  resolvedData: ComposeMap<Input, 'resolvedData'>;
  clientData: ComposeMap<Input, 'clientData'>;
  storageData: ComposeMap<Input, 'storageData'>;
  searchIndexData: ComposeMap<Input, 'searchIndexData'>;
  isContainer: true;
};

type NestedPathKey<T, Input> = keyof T & keyof Input & string;

type BaseNestedPath<T, Input extends ComposeInput> = {
  [K in NestedPathKey<T, Input>]:
    | NestedPathDot<ComponentSchemaNestedPathDetails<T[K], Input[K]>, K>
    | {
        path: K;
        value: T[K];
      };
}[NestedPathKey<T, Input>];

type NestedPath<T, Input extends ComposeInput> =
  BaseNestedPath<T, Input> extends never
    ? { path: string; value: Record<string, unknown> }
    : BaseNestedPath<T, Input>;

type NestedPathShape<Input extends ComposeInput> = {
  [K in keyof Input]: Input[K] extends ComponentSchema<infer Id, infer Args>
    ? ComponentNestedPathShape<Id, Args>
    : unknown;
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<ComposeEntry<Args>>;
  }

  interface ComponentNestedPathMap<T, Args> {
    [id]: NestedPath<T, ResolveComposeInput<Args>>;
  }

  interface ComponentNestedPathShapeMap<Args> {
    [id]: NestedPathShape<ResolveComposeInput<Args>>;
  }
}
