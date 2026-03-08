import { ComponentStorageDataById } from './storage.js';
import { ComponentId, ComponentOptionsById } from './types.js';

export type ForeignComponentAtomWalkerContext = {
  walk: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    apply: ComponentAtomWalkerApplyFn
  ) => void;
};

export type ComponentAtomWalkerApplyFn = <Id extends ComponentId, Args>(
  componentId: Id,
  data: ComponentStorageDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>
) => void;

export type ComponentAtomWalker<Id extends ComponentId> = <Args>(
  data: ComponentStorageDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  apply: ComponentAtomWalkerApplyFn,
  context: ForeignComponentAtomWalkerContext
) => void;
