declare module 'virtual:dashboard/componentConnector' {
  import type {
    ComponentClientModule,
    ComponentDataById,
    ComponentDataValidatorById,
    ComponentId,
    ComponentOptionsById,
    ForeignComponentContext,
  } from '@game-cms/types';

  export function getComponentIds(): ComponentId[];

  export function getComponentDefaultData<Id extends ComponentId>(
    id: Id,
    options: ComponentOptionsById<Id>,
    context: ForeignComponentContext['default']
  ): ComponentDataById<Id>;

  export function getComponentValidator<Id extends ComponentId>(
    id: Id
  ): ComponentDataValidatorById<Id>;

  export declare function importComponent<Id extends ComponentId>(
    id: Id
  ): Promise<ComponentClientModule<Id>>;
}
