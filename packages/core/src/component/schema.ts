import { IsAllOptional } from '@game-cms/shared';

import {
  ComponentData,
  ComponentId,
  ComponentOptions,
  ComponentOptionsById,
  GetComponentTypesById,
} from './types.js';

export type ComponentSchema<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  componentId: Id;
  options: ComponentOptionsById<Id, Args>;
};

export type GetComponentSchemaTypes<Schema = unknown> =
  Schema extends ComponentSchema<infer Id, infer Args>
    ? GetComponentTypesById<Id, Args> & {
        componentId: Id;
        args: Args;
      }
    : {
        rawData: ComponentData;
        rawInData: ComponentData;
        partialRawInData: ComponentData;
        resolvedData: ComponentData;
        storageData: ComponentData;
        partialStorageData: ComponentData;
        clientData: ComponentData;
        searchIndexData: unknown;
        options: ComponentOptions;
        error: unknown;
        componentId: ComponentId;
        args: unknown;
      };

export type GetComponentSchemaId<Schema = unknown> =
  Schema extends ComponentSchema<infer Id> ? Id : never;

export type GetComponentSchemaArgs<Schema = unknown> =
  Schema extends ComponentSchema<string, infer Args> ? Args : never;

type ComponentAccessor<Id extends ComponentId> =
  IsAllOptional<ComponentOptionsById<Id>> extends true
    ? <Args>(
        input?: ComponentOptionsById<Id, Args>
      ) => ComponentSchema<Id, Args>
    : <Args>(
        input: ComponentOptionsById<Id, Args>
      ) => ComponentSchema<Id, Args>;

/*@__NO_SIDE_EFFECTS__*/
export function componentAccessor<Id extends string>(
  componentId: Id
): ComponentAccessor<Id> {
  return (options = {}) => {
    return { componentId, options };
  };
}
