declare module 'virtual:dashboard/componentConnectorData' {
  import type {
    ComponentBuildMeta,
    ComponentClientController,
    ComponentId,
    ComponentRendererByVariant,
    ComponentRendererVariant,
  } from '@game-cms/core';

  type ComponentDataEntryRenderers<Id extends ComponentId> = {
    [K in ComponentRendererVariant]:
      | (() => Promise<ComponentRendererByVariant<K, Id>>)
      | undefined;
  };

  type ComponentDataEntry<Id extends ComponentId> = {
    renderers: ComponentDataEntryRenderers<Id>;
    client: ComponentClientController<Id>;
    meta: ComponentBuildMeta<Id>;
  };

  type ComponentDataMap = {
    [Id in ComponentId]: ComponentDataEntry<Id>;
  };

  const _default: ComponentDataMap;

  export default _default;
}
