import { ComponentSchema } from '@game-cms/core';

import { DropdownItem } from './types.js';

export function dropdown<K extends string>(
  items: DropdownItem<K>[]
): ComponentSchema<'base::dropdown', { key: K }> {
  if (items.length === 0) {
    throw new Error('Items cannot be empty');
  }

  return {
    componentId: 'base::dropdown',
    options: { items },
  };
}
