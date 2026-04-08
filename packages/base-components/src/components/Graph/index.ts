import { ComponentId, ComponentSchema } from '@game-cms/core';

import { Id, id } from './types.js';

export function graph<CId extends ComponentId, Args>(args: {
  component: ComponentSchema<CId, Args>;
}): ComponentSchema<Id, { id: CId; baseArgs: Args }> {
  return {
    componentId: id,
    options: {
      componentId: args.component.componentId,
      baseOptions: args.component.options,
    },
  };
}
