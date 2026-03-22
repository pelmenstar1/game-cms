import { ComponentAtomWalker } from './atomWalker.js';
import { ComponentClientOptionsTransformer } from './client.js';
import { ComponentCore } from './core.js';
import { ComponentDataMergeHandler } from './merge.js';
import {
  ComponentDataMigration,
  ComponentDataStructureSource,
} from './migration.js';
import { ComponentDataResolver } from './resolve.js';
import { ComponentSearchController } from './search.js';
import { ComponentStorageDataTransformer } from './storage.js';
import { ComponentId, ComponentOptionsById } from './types.js';
import { RequiredIfExists } from './typeutil.js';
import {
  ComponentDataValidatorParams,
  ComponentDataValidatorResult,
} from './validation.js';

export type ForeignComponentValidationContext = {
  validate: <Id extends ComponentId, Args>(
    id: Id,
    data: unknown, // ComponentInDataById<Id, Args>
    options: ComponentOptionsById<Id, Args>,
    params?: ComponentDataValidatorParams
  ) => ComponentDataValidatorResult<Id, Args>;
};

export type ComponentDataValidator<Id extends ComponentId> = <Args = unknown>(
  data: unknown, // ComponentInDataById<Id, Args>
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentValidationContext,
  params?: ComponentDataValidatorParams
) => ComponentDataValidatorResult<Id, Args>;

interface BaseComponentController<Id extends ComponentId = ComponentId> {
  core: ComponentCore<Id>;
  validator: ComponentDataValidator<Id>;
  structure?: ComponentDataStructureSource<Id>;
  migrate?: ComponentDataMigration<Id>;
  atomWalker?: ComponentAtomWalker<Id>;
}

export type ComponentController<Id extends ComponentId = ComponentId> =
  BaseComponentController<Id> &
    RequiredIfExists<
      { resolver?: ComponentDataResolver<Id> },
      Id,
      'resolvedData'
    > &
    RequiredIfExists<
      { storageTransformer?: ComponentStorageDataTransformer<Id> },
      Id,
      'storageData' | 'inData'
    > &
    RequiredIfExists<
      { mergeData?: ComponentDataMergeHandler<Id> },
      Id,
      'partialInData'
    > &
    RequiredIfExists<
      { search?: ComponentSearchController<Id> },
      Id,
      'searchIndexData'
    > &
    RequiredIfExists<
      { clientOptionsTransformer?: ComponentClientOptionsTransformer<Id> },
      Id,
      'clientOptions'
    >;

export type ComponentControllerMap = {
  [Id in ComponentId]: ComponentController<Id>;
};

/*@__NO_SIDE_EFFECTS__*/
export function defineComponentController<Id extends ComponentId>(
  value: ComponentController<Id>
) {
  return value;
}
