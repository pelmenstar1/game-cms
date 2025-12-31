import {
  ComponentClientDataById,
  ComponentData,
  ComponentDataById,
  ComponentErrorById,
  ComponentId,
  ComponentOptions,
  ComponentOptionsById,
  ComponentResolvedDataById,
  ComponentSchema,
} from '@game-cms/types';

export type ComponentGroupItem<Id extends ComponentId = ComponentId> = {
  componentId: Id;
  options: ComponentOptionsById<Id>;
};

export type ComponentGroup<T> = {
  [K in keyof T]: ComponentGroupItem;
};

export type GetSchemaParams<T = unknown> =
  T extends ComponentSchema<infer Id, infer Args>
    ? {
        options: ComponentOptionsById<Id, Args>;
        data: ComponentDataById<Id, Args>;
        error: ComponentErrorById<Id, Args> | undefined;
        id: Id;
        resolvedData: ComponentResolvedDataById<Id, Args>;
        clientData: ComponentClientDataById<Id, Args>;
      }
    : {
        options: ComponentOptions;
        data: ComponentData;
        error: unknown;
        id: ComponentId;
        resolvedData: ComponentData;
        clientData: ComponentData;
      };
