import type { ComponentId, ComponentSchema } from '@game-cms/core';
import { GameAssetPipeline } from '@game-cms/game-plugin-core';

import { type AssetWrapperArgs, type Id, id } from './types';

export function assetWrapper<CId extends ComponentId, Args>(input: {
  pipeline: GameAssetPipeline;
  component: ComponentSchema<CId, Args>;
}): ComponentSchema<Id, AssetWrapperArgs<CId, Args>> {
  const { component, pipeline } = input;

  return {
    componentId: id,
    options: {
      pipeline,
      componentId: component.componentId,
      baseOptions: component.options,
    },
  };
}
