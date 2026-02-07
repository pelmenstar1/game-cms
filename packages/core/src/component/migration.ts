import { ComponentStorageDataById } from './storage.js';
import { ComponentId, ComponentOptionsById } from './types.js';

export interface ForeignComponentDataMigrationContext {
  migrate: <Id extends ComponentId, Args>(
    id: Id,
    data: unknown,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentStorageDataById<Id, Args>;
}

export type ComponentDataMigration<Id extends ComponentId> = <Args>(
  data: unknown,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataMigrationContext
) => ComponentStorageDataById<Id, Args> | undefined;

export type ComponentDataStructure =
  | string
  | number
  | ComponentDataStructure[]
  | {
      [K in string]: ComponentDataStructure;
    };

export interface ForeignComponentDataStructureContext {
  getStructure: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentDataStructure;
}

export type ComponentDataStructureSource<Id extends ComponentId> =
  | ComponentDataStructure
  | (<Args>(
      options: ComponentOptionsById<Id, Args>,
      context: ForeignComponentDataStructureContext
    ) => ComponentDataStructure);
