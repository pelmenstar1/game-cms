import { ComponentCore } from './core.js';
import { ComponentDataMergeHandler } from './merge.js';
import {
  ComponentDataMigration,
  ComponentDataStructureSource,
} from './migration.js';
import { ComponentDataResolver } from './resolve.js';
import { ComponentSearchController } from './search.js';
import { ComponentStorageDataTransformer } from './storage.js';
import { ComponentId } from './types.js';
import { RequiredIfExists } from './typeutil.js';

interface BaseComponentController<Id extends ComponentId = ComponentId> {
  core: ComponentCore<Id>;
  structure?: ComponentDataStructureSource<Id>;
  migrate?: ComponentDataMigration<Id>;
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
      'storageData' | 'rawInData'
    > &
    RequiredIfExists<
      { mergeData?: ComponentDataMergeHandler<Id> },
      Id,
      'partialRawInData'
    > &
    RequiredIfExists<
      { search?: ComponentSearchController<Id> },
      Id,
      'searchIndexData'
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
