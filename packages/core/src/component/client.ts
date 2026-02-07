import { IdSource, ResultOrError } from '@game-cms/shared';
import { Key, ReactNode } from 'react';

import { ForeignComponentValidationContext } from './core.js';
import {
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRawInDataById,
  GetComponentTypesById,
} from './types.js';

export type ComponentClientDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['clientData'];

export type ComponentProps<Id extends ComponentId, Args> = {
  data: ComponentClientDataById<Id, Args>;
  options: ComponentOptionsById<Id, Args>;
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

export type ComponentRawInDataOrError<
  Id extends ComponentId,
  Args = unknown,
> = ResultOrError<
  ComponentRawInDataById<Id, Args>,
  ComponentErrorById<Id, Args>
>;

export type ForeignComponentClientDataResolverContext = {
  idSource: IdSource<Key>;
  validation: ForeignComponentValidationContext;

  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentClientDataById<Id, Args>;

  toClient: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentClientDataById<Id, Args>;

  fromClient: <Id extends ComponentId, Args>(
    id: Id,
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentRawInDataOrError<Id, Args>;
};

export type ForeignComponentClientDefaultDataContext = Pick<
  ForeignComponentClientDataResolverContext,
  'getDefaultData'
>;

export type ComponentClientDataTransformer<
  Id extends ComponentId = ComponentId,
> = {
  /**
   * Determines whether fromClient will its own validation scheme.
   */
  ownValidation?: boolean;

  getDefaultData: <Args>(
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDefaultDataContext
  ) => ComponentClientDataById<Id, Args>;

  toClient: <Args>(
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDataResolverContext
  ) => ComponentClientDataById<Id, Args>;

  fromClient: <Args>(
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDataResolverContext
  ) => ComponentRawInDataOrError<Id, Args>;
};
