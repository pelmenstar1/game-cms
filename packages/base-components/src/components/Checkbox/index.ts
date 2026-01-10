import { ComponentSchema } from '@game-cms/core';

import { CheckboxChoice } from './types.js';

export function checkbox<K extends string>(
  choices: Record<K, CheckboxChoice>
): ComponentSchema<'base::checkbox', { key: K }> {
  return {
    componentId: 'base::checkbox',
    options: { choices: choices as Record<string, CheckboxChoice> },
  };
}
