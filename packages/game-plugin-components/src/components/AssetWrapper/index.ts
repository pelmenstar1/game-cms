import type { ComponentId, ComponentSchema } from '@game-cms/core';

import type { AssetWrapperArgs } from './types';

export function assetWrapper<Id extends ComponentId, Args>(input: {
  pipelineId: string;
  component: ComponentSchema<Id, Args>;
}): ComponentSchema<'game::asset-wrapper', AssetWrapperArgs<Id, Args>> {
  const { component, pipelineId } = input;

  return {
    componentId: 'game::asset-wrapper',
    options: {
      pipelineId,
      componentId: component.componentId,
      baseOptions: component.options,
    },
  };
}
