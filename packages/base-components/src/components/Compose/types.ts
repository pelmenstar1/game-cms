/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentEntry, ComponentId, ComponentSchema } from '@game-cms/types';

import { GetSchemaParams } from '../../internal/types.js';

export type ComposeInput = Record<string, ComponentSchema<ComponentId, any>>;

type ResolveInput<T> = unknown extends T ? ComposeInput : T;
type ComposeMap<T, TK extends keyof GetSchemaParams> = {
  [K in keyof ResolveInput<T>]: GetSchemaParams<T>[TK];
};

type ComposeOptionsEntry<T = unknown> = {
  componentId: GetSchemaParams<T>['id'];
  options: GetSchemaParams<T>['options'];
};

declare module '@game-cms/types' {
  interface ComponentTypeMap<_Args> {
    'base::compose': ComponentEntry<{
      data: ComposeMap<_Args, 'data'>;
      options: {
        [K in keyof ResolveInput<_Args>]: ComposeOptionsEntry<
          ResolveInput<_Args>[K]
        >;
      };
      error: ComposeMap<_Args, 'error'>;
      resolvedData: ComposeMap<_Args, 'resolvedData'>;
      clientData: ComposeMap<_Args, 'clientData'>;
    }>;
  }
}
