import { GetPropertyOr } from '@game-cms/shared';

// Saves type info about referenceable values
// (e.g. what can be referenced in other value types).
export interface ReferenceableTypeRegistry {
  // Expected shape:
  // 'some-id': {
  //   // Something that describes the value - a handle.
  //   // Needs to be serializable, as it will be stored in the DB.
  //   handle: unknown;
  // }
}

export type ReferenceableId = keyof ReferenceableTypeRegistry extends never
  ? string
  : keyof ReferenceableTypeRegistry;

type TypeInfoById<Id extends ReferenceableId> = GetPropertyOr<
  ReferenceableTypeRegistry,
  Id,
  unknown
>;

export type ReferenceableHandleDataById<Id extends ReferenceableId> =
  GetPropertyOr<TypeInfoById<Id>, 'handle', unknown>;

export type ReferenceableHandleDescriptor<
  Id extends ReferenceableId = ReferenceableId,
> = {
  id: Id;
  data: ReferenceableHandleDataById<Id>;
};
