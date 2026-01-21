import { ComponentId, ComponentSchema } from '@game-cms/core';

export function graph<Id extends ComponentId, Args>(args: {
  component: ComponentSchema<Id, Args>;
}): ComponentSchema<'base::graph', { id: Id; baseArgs: Args }> {
  return {
    componentId: 'base::graph',
    options: {
      componentId: args.component.componentId,
      baseOptions: args.component.options,
    },
  };
}
