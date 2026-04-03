import { EntityId } from '@game-cms/base-core';
import { ComponentEntry } from '@game-cms/core';
import { ObjectId } from 'mongodb';

type EntityComponentEntry = {
  outData: string | null;
  inData: string | null;
  options: {
    entityId: EntityId;
  };
  error: 'INVALID_TYPE';
  storageData: ObjectId | null;
};

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'base::entity-reference': ComponentEntry<EntityComponentEntry>;
  }
}
