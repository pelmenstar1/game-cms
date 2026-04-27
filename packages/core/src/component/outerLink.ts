import { ReferenceableHandleDescriptor } from '../reference.js';
import { ComponentStorageDataById } from './storage.js';
import { ComponentId, ComponentOptionsById } from './types.js';

export interface ForeignComponentOuterLinkControllerContext {
  contains: <Id extends ComponentId, Args>(
    outerLink: ReferenceableHandleDescriptor,
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => boolean;

  delete: <Id extends ComponentId, Args>(
    outerLink: ReferenceableHandleDescriptor,
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentStorageDataById<Id, Args>;
}

export type ComponentOuterLinkController<Id extends ComponentId = ComponentId> =
  {
    contains: <Args>(
      outerLink: ReferenceableHandleDescriptor,
      data: ComponentStorageDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>,
      context: ForeignComponentOuterLinkControllerContext
    ) => boolean;

    delete: <Args>(
      outerLink: ReferenceableHandleDescriptor,
      data: ComponentStorageDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>,
      context: ForeignComponentOuterLinkControllerContext
    ) => ComponentStorageDataById<Id, Args>;
  };
