import type {
  ComponentId,
  ComponentRawInDataById,
  ComponentRawInDataByIdPathExtends,
  ComponentSchema,
} from '@game-cms/core';

import type { SpritesheetArgs } from './types';

export function spritesheetWrapper<Id extends ComponentId, Args>(input: {
  namePath: ComponentRawInDataByIdPathExtends<string, Id, Args>;
  bundlePath: ComponentRawInDataByIdPathExtends<string, Id, Args>;
  imagePath: ComponentRawInDataByIdPathExtends<
    ComponentRawInDataById<'base::file'>,
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
