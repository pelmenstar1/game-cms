import { EntityId } from '@game-cms/base-core';
import { ComponentEntry } from '@game-cms/core';
import { ObjectId } from 'mongodb';

export const id = 'base::entity-reference' as const;
export type Id = typeof id;

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
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<EntityComponentEntry>;
  }
}
