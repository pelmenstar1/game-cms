import type {
  ComponentId,
  ComponentInDataById,
  ComponentInDataByIdPathExtends,
  ComponentSchema,
} from '@game-cms/core';

import type { SpritesheetArgs } from './types';

export function spritesheetWrapper<Id extends ComponentId, Args>(input: {
  namePath: ComponentInDataByIdPathExtends<string, Id, Args>;
  bundlePath: ComponentInDataByIdPathExtends<string, Id, Args>;
  imagePath: ComponentInDataByIdPathExtends<
    ComponentInDataById<'base::file'>,
    Id,
    Args
  >;
  component: ComponentSchema<Id, Args>;
}): ComponentSchema<'game::spritesheet-wrapper', SpritesheetArgs<Id, Args>> {
  const { component, bundlePath, imagePath, namePath } = input;

  return {
    componentId: 'game::spritesheet-wrapper',
    options: {
      namePath,
      bundlePath,
      imagePath,
      componentId: component.componentId,
      baseOptions: component.options,
    },
  };
}
