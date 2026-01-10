import type {
  ComponentId,
  ComponentOptionsById,
  ForeignComponentDefaultDataContext,
} from '@game-cms/core';
import data from 'virtual:dashboard/componentConnectorData';

export function getComponentDefaultData<Id extends ComponentId>(
  id: Id,
  options: ComponentOptionsById<Id>,
  context: ForeignComponentDefaultDataContext
) {
  return data[id].core.defaultRawData(options, context);
}

export function getComponentValidator<Id extends ComponentId>(id: Id) {
  return data[id].core.validator;
}

export function getComponentClientTransformer<Id extends ComponentId>(id: Id) {
  return data[id].client?.clientTransformer;
}

export function getComponentMeta(id: ComponentId) {
  return data[id].core.meta;
}

export function importComponent<Id extends ComponentId>(id: Id) {
  return data[id].renderer();
}
