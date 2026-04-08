import './types.js';
export * from './types.js';

import { ComponentId, ComponentSchema } from '@game-cms/core';

import { TitleSpecById } from '../../internal/title.js';
import { Id, id } from './internal/types.js';
import { RepeatableArgs } from './types.js';

export function repeatable<CId extends ComponentId, Args>(args: {
  title?: TitleSpecById<CId, Args>;
  component: ComponentSchema<CId, Args>;
}): ComponentSchema<Id, RepeatableArgs<CId, Args>> {
  const { title, component: baseComponent } = args;

  return {
    componentId: id,
    options: {
      title,
      componentId: baseComponent.componentId,
      baseOptions: baseComponent.options,
    },
  };
}
