import { IdSource } from '@game-cms/shared';
import { Key } from 'react';

import {
  ComponentClientOptionsById,
  ComponentId,
  ComponentInDataById,
  ComponentOutDataById,
} from '../types.js';
import { ComponentClientContext } from './context.js';
import { ComponentClientDataById } from './types.js';
import { ForeignComponentClientValidationContext } from './validator.js';

export interface ForeignComponentClientDefaultDataContext {
  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentClientOptionsById<Id, Args>
  ) => ComponentClientDataById<Id, Args>;
}

export interface ForeignComponentClientDataTransformerContext extends ForeignComponentClientDefaultDataContext {
  idSource: IdSource<Key>;
  validation: ForeignComponentClientValidationContext;
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
  ) => ComponentInDataById<Id, Args>;
}

export type ComponentClientDataTransformer<
  Id extends ComponentId = ComponentId,
> = {
  toClient: <Args>(
    data: ComponentOutDataById<Id, Args>,
    options: ComponentClientOptionsById<Id, Args>,
    context: ForeignComponentClientDataTransformerContext
  ) => ComponentClientDataById<Id, Args>;

  fromClient: <Args>(
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentClientOptionsById<Id, Args>,
    context: ForeignComponentClientDataTransformerContext
  ) => ComponentInDataById<Id, Args>;
};
