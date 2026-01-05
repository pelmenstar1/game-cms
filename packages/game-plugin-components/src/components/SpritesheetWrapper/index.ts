import type { ComponentId, ComponentSchema } from '@game-cms/core';

import type { SpritesheetArgs } from './types';

export function spritesheetWrapper<Id extends ComponentId, Args>(input: {
  component: ComponentSchema<Id, Args>;
}): ComponentSchema<'game::spritesheet-wrapper', SpritesheetArgs<Id, Args>> {
  const { component } = input;

  return {
    componentId: 'game::spritesheet-wrapper',
    options: {
      componentId: component.componentId,
      baseOptions: component.options,
    },
  };
}
