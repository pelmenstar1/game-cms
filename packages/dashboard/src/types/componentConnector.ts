import type {
  ComponentClientDataTransformer,
  ComponentClientModule,
  ComponentControllerConfig,
  ComponentDataValidator,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ForeignComponentDefaultDataContext,
} from '@game-cms/core';

export interface ComponentConnector {
  getComponentDefaultData<Id extends ComponentId>(
    id: Id,
    options: ComponentOptionsById<Id>,
    context: ForeignComponentDefaultDataContext
  ): ComponentRawDataById<Id>;

  getComponentValidator<Id extends ComponentId>(
    id: Id
  ): ComponentDataValidator<Id>;

  getComponentClientTransformer<Id extends ComponentId>(
    id: Id
  ): ComponentClientDataTransformer<Id> | undefined;

  getComponentConfig(id: ComponentId): ComponentControllerConfig;

  importComponent<Id extends ComponentId>(
    id: Id
  ): Promise<ComponentClientModule<Id>>;
}
