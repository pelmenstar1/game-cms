import type {
  ComponentClientDataResolver,
  ComponentClientModule,
  ComponentControllerConfig,
  ComponentDataById,
  ComponentDataValidatorById,
  ComponentId,
  ComponentOptionsById,
  ForeignComponentContext,
} from '@game-cms/types';

export interface ComponentConnector {
  getComponentDefaultData<Id extends ComponentId>(
    id: Id,
    options: ComponentOptionsById<Id>,
    context: ForeignComponentContext['default']
  ): ComponentDataById<Id>;

  getComponentValidator<Id extends ComponentId>(
    id: Id
  ): ComponentDataValidatorById<Id>;

  getComponentClientResolver<Id extends ComponentId>(
    id: Id
  ): ComponentClientDataResolver<Id> | undefined;

  getComponentConfig(id: ComponentId): ComponentControllerConfig;

  importComponent<Id extends ComponentId>(
    id: Id
  ): Promise<ComponentClientModule<Id>>;
}
