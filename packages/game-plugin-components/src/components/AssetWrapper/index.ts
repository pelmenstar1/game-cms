import type { ComponentId, ComponentSchema } from '@game-cms/core';
import { GameAssetPipeline } from '@game-cms/game-plugin-core';

import type { AssetWrapperArgs } from './types';

export function assetWrapper<Id extends ComponentId, Args>(input: {
  pipeline: GameAssetPipeline;
  component: ComponentSchema<Id, Args>;
}): ComponentSchema<'game::asset-wrapper', AssetWrapperArgs<Id, Args>> {
  const { component, pipeline } = input;

  return {
    componentId: 'game::asset-wrapper',
    options: {
      pipeline,
      componentId: component.componentId,
      baseOptions: component.options,
    },
  };
}
