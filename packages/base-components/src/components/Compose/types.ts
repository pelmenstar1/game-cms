import {
  ComponentEntry,
  ComponentSchema,
  GetComponentSchemaTypes,
} from '@game-cms/core';

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
  resolvedData: ComposeMap<Input, 'resolvedData'>;
  clientData: ComposeMap<Input, 'clientData'>;
  storageData: ComposeMap<Input, 'storageData'>;
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::compose': ComponentEntry<ComposeEntry<_Args>>;
  }
}
