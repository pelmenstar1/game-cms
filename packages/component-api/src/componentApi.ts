import type {
  ComponentDefaultRenderer,
  ComponentId,
  ComponentMeta,
  ComponentRendererByVariant,
  ComponentRendererVariant,
  ForeignComponentClientDataTransformerContext,
  ForeignComponentClientValidationContext,
  ForeignComponentPathWalkerContext,
} from '@game-cms/core';
import { IdSource } from '@game-cms/shared';
import React, { type Key } from 'react';

type BaseImportRendererModuleResult<T> =
  | Promise<T>
  | (T extends undefined ? undefined : never);

type ImportRendererModuleResult<
  Id extends ComponentId,
  Variant extends ComponentRendererVariant,
> = BaseImportRendererModuleResult<ComponentRendererByVariant<Variant, Id>>;

export type ComponentApi = {
  generateId: IdSource<Key>;

  getDefaultRenderer: <Id extends ComponentId>(
    id: Id
  ) => ComponentDefaultRenderer<Id>;

  getRendererByVariant: <
    Id extends ComponentId,
    Variant extends ComponentRendererVariant,
  >(
    id: Id,
    variant: Variant
  ) => ImportRendererModuleResult<Id, Variant>;

  hasRendererByVariant: (
    id: ComponentId,
    variant: ComponentRendererVariant
  ) => boolean;

  getDefaultData: ForeignComponentClientDataTransformerContext['getDefaultData'];
  validate: ForeignComponentClientValidationContext['validate'];
  getMeta: (id: ComponentId) => ComponentMeta | undefined;
  applyAtPath: ForeignComponentPathWalkerContext['applyAtPath'];
};

export const ComponentApiContext =
  /*@__PURE__*/ React.createContext<ComponentApi | null>(null);

export function useComponentApi() {
  const result = React.useContext(ComponentApiContext);
  if (result === null) {
    throw new Error('ComponentApiContext is not in the tree');
  }

  return result;
}
