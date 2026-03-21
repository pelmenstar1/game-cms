import { IdSource, ResultOrError } from '@game-cms/shared';
import { Key, ReactNode } from 'react';

import { ForeignComponentValidationContext } from './core.js';
import {
  ComponentClientOptionsById,
  ComponentErrorById,
  ComponentId,
  ComponentInDataById,
  ComponentOptionsById,
  ComponentOutDataById,
  GetComponentTypesById,
} from './types.js';

export type ComponentClientDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['clientData'];

export type ComponentProps<Id extends ComponentId, Args> = {
  data: ComponentClientDataById<Id, Args>;
  options: ComponentClientOptionsById<Id, Args>;
  error?: ComponentErrorById<Id, Args>;
  readonly?: boolean;
  onDataChanged?: (data: ComponentClientDataById<Id, Args>) => void;
};

export type ComponentRenderer<Id extends ComponentId = ComponentId> = <
  Args = unknown,
>(
  props: ComponentProps<Id, Args>
) => ReactNode;

export type ComponentClientModule<Id extends ComponentId = ComponentId> = {
  renderer: ComponentRenderer<Id>;
};

export type ComponentInDataOrError<
  Id extends ComponentId,
  Args = unknown,
> = ResultOrError<ComponentInDataById<Id, Args>, ComponentErrorById<Id, Args>>;

export interface ForeignComponentClientDefaultDataContext {
  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentClientOptionsById<Id, Args>
  ) => ComponentClientDataById<Id, Args>;
}

export interface ForeignComponentClientDataTransformerContext extends ForeignComponentClientDefaultDataContext {
  idSource: IdSource<Key>;
  validation: ForeignComponentValidationContext;
  sharedContext: ComponentClientContext | undefined;

  toClient: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentOutDataById<Id, Args>,
    options: ComponentClientOptionsById<Id, Args>
  ) => ComponentClientDataById<Id, Args>;

  fromClient: <Id extends ComponentId, Args>(
    id: Id,
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentClientOptionsById<Id, Args>
  ) => ComponentInDataOrError<Id, Args>;
}

export type ComponentClientDataTransformer<
  Id extends ComponentId = ComponentId,
> = {
  /**
   * Determines whether fromClient will its own validation scheme.
   */
  ownValidation?: boolean;

  getDefaultData: <Args>(
    options: ComponentClientOptionsById<Id, Args>,
    context: ForeignComponentClientDefaultDataContext
  ) => ComponentClientDataById<Id, Args>;

  toClient: <Args>(
    data: ComponentOutDataById<Id, Args>,
    options: ComponentClientOptionsById<Id, Args>,
    context: ForeignComponentClientDataTransformerContext
  ) => ComponentClientDataById<Id, Args>;

  fromClient: <Args>(
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentClientOptionsById<Id, Args>,
    context: ForeignComponentClientDataTransformerContext
  ) => ComponentInDataOrError<Id, Args>;
};

export type ForeignComponentClientOptionsTransformerContext = {
  toClient: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentClientOptionsById<Id, Args>;
};

export type ComponentClientOptionsTransformer<
  Id extends ComponentId = ComponentId,
> = {
  toClient: <Args>(
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientOptionsTransformerContext
  ) => ComponentClientOptionsById<Id, Args>;
};

// Contains values/functions that can be read/executed only on both client-side and server-side.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentClientContext {}

export type ComponentClientContextMap<K extends PropertyKey = string> = Record<
  K,
  ComponentClientContext | undefined
>;
