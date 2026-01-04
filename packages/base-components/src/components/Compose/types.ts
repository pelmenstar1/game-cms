import { ComponentEntry, ComponentSchema } from '@game-cms/core';

import { GetSchemaParams } from '../../internal/types.js';

export type ComposeInput = Record<string, ComponentSchema>;

export type ResolveComposeInput<T> = T extends ComposeInput ? T : ComposeInput;

type ComposeMap<
  Input extends ComposeInput,
  TK extends keyof GetSchemaParams,
> = {
  [K in keyof Input]: GetSchemaParams<Input[K]>[TK];
};

export type ComposeOptionsEntry<T extends ComponentSchema = ComponentSchema> =
  Pick<T, 'componentId' | 'options'>;

export type ComposeEntry<Args> = BaseComposeEntry<ResolveComposeInput<Args>>;

type BaseComposeEntry<Input extends ComposeInput> = {
  options: {
    [K in keyof Input]: ComposeOptionsEntry<Input[K]>;
  };
  error: {
    [K in keyof Input]: GetSchemaParams<Input[K]>['error'] | undefined;
  };
  rawData: ComposeMap<Input, 'rawData'>;
  resolvedData: ComposeMap<Input, 'resolvedData'>;
  clientData: ComposeMap<Input, 'clientData'>;
  storageData: ComposeMap<Input, 'storageData'>;
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::compose': ComponentEntry<ComposeEntry<_Args>>;
  }
}
