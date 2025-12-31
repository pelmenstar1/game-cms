import { ComponentEntry, ComponentSchema } from '@game-cms/types';

import { GetSchemaParams } from '../../internal/types.js';

export type ComposeInput = Record<string, ComponentSchema>;

type ResolveInput<T> = T extends ComposeInput ? T : ComposeInput;
type ComposeMap<
  Input extends ComposeInput,
  TK extends keyof GetSchemaParams,
> = {
  [K in keyof Input]: GetSchemaParams<Input>[TK];
};

export type ComposeOptionsEntry<T extends ComponentSchema = ComponentSchema> =
  Pick<T, 'componentId' | 'options'>;

type ComposeEntry<Input extends ComposeInput> = {
  data: ComposeMap<Input, 'data'>;
  options: {
    [K in keyof Input]: ComposeOptionsEntry<Input[K]>;
  };
  error: {
    [K in keyof Input]: GetSchemaParams<Input[K]>['error'] | undefined;
  };
  resolvedData: ComposeMap<Input, 'resolvedData'>;
  clientData: ComposeMap<Input, 'clientData'>;
};

declare module '@game-cms/types' {
  interface ComponentTypeMap<_Args> {
    'base::compose': ComponentEntry<ComposeEntry<ResolveInput<_Args>>>;
  }
}
