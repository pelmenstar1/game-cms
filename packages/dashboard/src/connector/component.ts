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
import data from 'virtual:dashboard/componentConnectorData';

export function getComponentDefaultData<Id extends ComponentId>(
  id: Id,
  options: ComponentOptionsById<Id>,
  context: ForeignComponentDefaultDataContext
): ComponentRawDataById<Id> {
  return data[id].shared.defaultRawData(options, context);
}

export function getComponentValidator<Id extends ComponentId>(
  id: Id
): ComponentDataValidator<Id> {
  return data[id].shared.validator;
}

export function getComponentClientTransformer<Id extends ComponentId>(
  id: Id
): ComponentClientDataTransformer<Id> | undefined {
  return data[id].client?.clientTransformer;
}

export function getComponentConfig(
  id: ComponentId
): ComponentControllerConfig | undefined {
  return data[id].shared.meta.config;
}

export function importComponent<Id extends ComponentId>(
  id: Id
): Promise<ComponentClientModule<Id>> {
  return data[id].renderer();
}
