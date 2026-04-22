import { GetPropertyOr, MaybePromise } from '@game-cms/shared';

import { ComponentStorageDataById } from './storage.js';
import {
  ComponentId,
  ComponentOptionsById,
  ComponentTypeMap,
} from './types.js';
import { RequiredIfExists } from './typeutil.js';

export type ComponentSearchIndexDataById<
  T extends ComponentId,
  Args = unknown,
> = GetPropertyOr<ComponentTypeMap<Args>[T], 'searchIndexData', unknown>;

export type ComponentDataSearchTarget<
  Id extends ComponentId,
  Args = unknown,
> = {
  storage: ComponentStorageDataById<Id, Args>;
} & RequiredIfExists<
  { searchIndex?: ComponentSearchIndexDataById<Id, Args> },
  Id,
  'searchIndexData',
  Args
>;

export interface ForeignComponentDataSearchContext {
  getScore: <Id extends ComponentId, Args>(
    query: string,
    id: Id,
    target: ComponentDataSearchTarget<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => number;

  createSearchIndex: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => Promise<ComponentSearchIndexDataById<Id, Args>>;
}

export type ComponentDataSearchScoreFn<Id extends ComponentId> = <Args>(
  query: string,
  target: ComponentDataSearchTarget<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataSearchContext
) => number;

export type ComponentDataSearchIndexFn<Id extends ComponentId> = <Args>(
  data: ComponentStorageDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataSearchContext
) => MaybePromise<ComponentSearchIndexDataById<Id, Args>>;

export type ComponentSearchController<Id extends ComponentId = ComponentId> = {
  getScore: ComponentDataSearchScoreFn<Id>;
} & RequiredIfExists<
  { createIndex?: ComponentDataSearchIndexFn<Id> },
  Id,
  'searchIndexData'
>;
