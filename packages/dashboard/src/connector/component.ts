import type {
  ComponentId,
  ComponentOptionsById,
  ForeignComponentDefaultDataContext,
} from '@game-cms/core';
import data from 'virtual:dashboard/componentConnectorData';

function getComponent<Id extends ComponentId>(id: Id) {
  const result = data[id];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!result) {
    throw new Error(`Unknown component: ${id}`);
  }

  return result;
}

export function getComponentDefaultData<Id extends ComponentId>(
  id: Id,
  options: ComponentOptionsById<Id>,
  context: ForeignComponentDefaultDataContext
) {
  return getComponent(id).core.defaultRawData(options, context);
}

export function getComponentValidator<Id extends ComponentId>(id: Id) {
  return getComponent(id).core.validator;
}

export function getComponentClientTransformer<Id extends ComponentId>(id: Id) {
  return getComponent(id).client?.clientTransformer;
}

export function getComponentMeta(id: ComponentId) {
  return getComponent(id).core.meta;
}

export function importComponent<Id extends ComponentId>(id: Id) {
  return getComponent(id).renderer();
}
