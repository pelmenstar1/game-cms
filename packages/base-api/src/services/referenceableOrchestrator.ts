import { ReferenceableHandleDescriptor, service } from '@game-cms/core';
import { cms } from '@game-cms/global';

type OnDeletedHandler = (descriptor: ReferenceableHandleDescriptor) => void;

declare module '@game-cms/base-core' {
  interface AppEventsRegistry {
    'base::referenceable::deleted': ReferenceableHandleDescriptor;
  }
}

export default service({
  lifecycle: {},
  onDeleted: (handler: OnDeletedHandler) => {
    return cms()
      .service('base::appEvents')
      .addHook('base::referenceable::deleted', handler);
  },
  emitDeleted: (descriptor: ReferenceableHandleDescriptor) => {
    cms()
      .service('base::appEvents')
      .emit('base::referenceable::deleted', descriptor);
  },
});
