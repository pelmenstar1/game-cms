import './types.js';

import { ComponentId, ComponentSchema } from '@game-cms/core';

import { TitleSpecById } from '../../internal/title.js';
import { RepeatableArgs } from './types.js';

export function repeatable<Id extends ComponentId, Args>(args: {
  title?: TitleSpecById<Id, Args>;
  component: ComponentSchema<Id, Args>;
}): ComponentSchema<'base::repeatable', RepeatableArgs<Id, Args>> {
  const { title, component: baseComponent } = args;

  return {
    componentId: 'base::repeatable',
    options: {
      title,
      componentId: baseComponent.componentId,
      baseOptions: baseComponent.options,
    },
  };
}
