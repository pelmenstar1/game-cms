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

export function getComponentDefaultOutData<Id extends ComponentId>(
  id: Id,
  options: ComponentOptionsById<Id>,
  context: ForeignComponentDefaultDataContext
) {
  return getComponent(id).client.core.defaultOutData(options, context);
}

export function getComponentPathWalker<Id extends ComponentId>(id: Id) {
  return getComponent(id).client.core.pathWalker;
}

export function getComponentClientController<Id extends ComponentId>(id: Id) {
  return getComponent(id).client;
}

export function importComponent<Id extends ComponentId>(id: Id) {
  return getComponent(id).renderer();
}
