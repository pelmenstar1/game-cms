import { ComponentId } from '@game-cms/core';

import { DynamicZoneInputEntry } from './types.js';

export function dynamicZoneEntry<Id extends ComponentId, Args>(
  value: DynamicZoneInputEntry<Id, Args>
) {
  return value;
}
