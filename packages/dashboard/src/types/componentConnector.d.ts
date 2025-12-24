declare module 'virtual:dashboard/componentConnector' {
  import type {
    ComponentClientModule,
    ComponentDataById,
    ComponentId,
  } from '@game-cms/types';

  export function getComponentIds(): ComponentId[];

  export function getComponentDefaultData<Id extends ComponentId>(
    id: Id
  ): ComponentDataById<Id>;

  export declare function importComponent<Id extends ComponentId>(
    id: Id
  ): Promise<ComponentClientModule<Id>>;
}
