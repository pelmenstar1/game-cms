import { ComponentCore } from '../core.js';
import {
  ComponentClientOptionsById,
  ComponentId,
  ComponentOptionsById,
} from '../types.js';
import { RequiredIfExists } from '../typeutil.js';
import {
  ComponentClientDataTransformer,
  ForeignComponentClientDefaultDataContext,
} from './transformer.js';
import { ComponentClientDataById } from './types.js';
import { ComponentClientDataValidator } from './validator.js';

export type ComponentMeta = {
  ui?: {
    compact?: boolean;
  };
};

type BaseComponentClientController<Id extends ComponentId> = {
  core: ComponentCore<Id>;
  meta?: ComponentMeta;
  validator: ComponentClientDataValidator<Id>;
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

export type ComponentClientController<Id extends ComponentId = ComponentId> =
  BaseComponentClientController<Id> &
    RequiredIfExists<
      {
        getDefaultData?: <Args>(
          options: ComponentClientOptionsById<Id, Args>,
          context: ForeignComponentClientDefaultDataContext
        ) => ComponentClientDataById<Id, Args>;

        transformer?: ComponentClientDataTransformer<Id>;
      },
      Id,
      'clientData'
    >;

export function defineComponentClientController<Id extends ComponentId>(
  value: ComponentClientController<Id>
) {
  return value;
}
