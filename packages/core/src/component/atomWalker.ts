import {
  ComponentStorageDataById,
  ForeignComponentStorageDefaultDataContext,
} from './storage.js';
import { ComponentId, ComponentOptionsById } from './types.js';

export interface ForeignComponentAtomWalkerContext extends ForeignComponentStorageDefaultDataContext {
  applyEach: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    apply: ComponentAtomWalkerApplyFn
  ) => void;

  filter: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    predicate: ComponentAtomWalkerPredicateFn
  ) => ComponentStorageDataById<Id, Args>;
}

export type ComponentAtomWalkerApplyFn = <Id extends ComponentId, Args>(
  componentId: Id,
  data: ComponentStorageDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>
) => void;

export type ComponentAtomWalkerPredicateFn = <Id extends ComponentId, Args>(
  componentId: Id,
  data: ComponentStorageDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>
) => boolean;

export type ComponentAtomWalker<Id extends ComponentId> = {
  applyEach: <Args>(
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    apply: ComponentAtomWalkerApplyFn,
    context: ForeignComponentAtomWalkerContext
  ) => void;

  filter: <Args>(
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    predicate: ComponentAtomWalkerPredicateFn,
    context: ForeignComponentAtomWalkerContext
  ) => ComponentStorageDataById<Id, Args>;
};
