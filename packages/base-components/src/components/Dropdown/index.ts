import { ComponentSchema } from '@game-cms/core';

import { DropdownItem, Id, id } from './types.js';

export function dropdown<K extends string>(
  items: DropdownItem<K>[]
): ComponentSchema<Id, { key: K }> {
  if (items.length === 0) {
    throw new Error('Items cannot be empty');
  }

  return {
    componentId: id,
    options: { items },
  };
}
