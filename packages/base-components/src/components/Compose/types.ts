import {
  ComponentEntry,
  ComponentNestedPathDot,
  ComponentNestedPathShape,
  ComponentSchema,
  ComponentSchemaNestedPath,
  GetComponentSchemaTypes,
  ParseComponentNestedPath,
} from '@game-cms/core';
import { GetPropertyOr } from '@game-cms/shared';

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
  error: {
    ownError?: 'INVALID_TYPE';
    properties?: {
      [K in keyof Input]:
        | GetComponentSchemaTypes<Input[K]>['error']
        | undefined;
    };
  };
  rawData: ComposeMap<Input, 'rawData'>;
  rawInData: ComposeMap<Input, 'rawInData'>;
  partialRawInData: Partial<ComposeMap<Input, 'partialRawInData'>>;
  resolvedData: ComposeMap<Input, 'resolvedData'>;
  clientData: ComposeMap<Input, 'clientData'>;
  storageData: ComposeMap<Input, 'storageData'>;
};

type NestedPath<T, Input extends ComposeInput> = {
  path: {
    [K in keyof Input]: ComponentNestedPathDot<
      K & string,
      ComponentSchemaNestedPath<T, Input[K]>
    >;
  }[keyof Input];
};

type NestedPathShape<Input extends ComposeInput> = {
  [K in keyof Input]: Input[K] extends ComponentSchema<infer Id, infer Args>
    ? ComponentNestedPathShape<Id, Args>
    : unknown;
};

type BaseParseNestedPathTransition<
  T,
  Prefix extends string,
  Suffix extends string,
  Input extends ComposeInput,
> =
  Input extends Record<Prefix, ComponentSchema<infer Id, infer Args>>
    ? T extends Record<Prefix, unknown>
      ? ParseComponentNestedPath<T[Prefix], Suffix, Id, Args>
      : unknown
    : unknown;

type BaseParseNestedPath<
  T,
  Path extends string,
  Input extends ComposeInput,
> = Path extends `${infer Prefix}.${infer Suffix}`
  ? BaseParseNestedPathTransition<T, Prefix, Suffix, Input>
  : GetPropertyOr<T, Path, unknown>;

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::compose': ComponentEntry<ComposeEntry<_Args>>;
  }

  interface ComponentNestedPathMap<T, Args> {
    'base::compose': NestedPath<T, ResolveComposeInput<Args>>;
  }

  interface ComponentNestedPathShapeMap<Args> {
    'base::compose': NestedPathShape<ResolveComposeInput<Args>>;
  }

  interface ComponentNestedPathParserMap<T, Path extends string, Args> {
    'base::compose': BaseParseNestedPath<T, Path, ResolveComposeInput<Args>>;
  }
}
