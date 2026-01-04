import './types.js';

import { ComponentId, ComponentSchema } from '@game-cms/core';

export function alternative<Id extends ComponentId, Args>(
  baseComponent: ComponentSchema<Id, Args>
): ComponentSchema<'base::alternative', { id: Id; baseArgs: Args }> {
  return {
    componentId: 'base::alternative',
    options: {
      componentId: baseComponent.componentId,
      baseOptions: baseComponent.options,
    },
  };
}
