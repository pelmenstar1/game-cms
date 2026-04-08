import { ComponentSchema } from '@game-cms/core';

import { CheckboxChoice, Id, id } from './types.js';

export function checkbox<K extends string>(
  choices: Record<K, CheckboxChoice>
): ComponentSchema<Id, { key: K }> {
  return {
    componentId: id,
    options: { choices: choices as Record<string, CheckboxChoice> },
  };
}
