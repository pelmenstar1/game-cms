import type {
  ComponentId,
  ComponentOptionsById,
  ComponentRendererByVariant,
  ComponentRendererVariant,
  ForeignComponentDefaultDataContext,
} from '@game-cms/core';
import data from 'virtual:dashboard/componentConnectorData';

type BaseImportRendererModuleResult<T> =
  Promise<T> | (T extends undefined ? undefined : never);

type ImportRendererModuleResult<
  Id extends ComponentId,
  Variant extends ComponentRendererVariant,
> = BaseImportRendererModuleResult<ComponentRendererByVariant<Variant, Id>>;

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

export function importRendererModule<
  Id extends ComponentId,
  Variant extends ComponentRendererVariant,
>(id: Id, variant: Variant) {
  const result = getComponent(id).renderers[variant]?.();

  return result as ImportRendererModuleResult<Id, Variant>;
}

export function hasComponentRenderer(
  id: ComponentId,
  variant: ComponentRendererVariant
) {
  return getComponent(id).meta.renderers.includes(variant);
}
