import {
  GroupedHeterogeneousEntityItems,
  HeterogeneousEntityItem,
} from './types.js';

export function groupItems(
  items: HeterogeneousEntityItem[]
): GroupedHeterogeneousEntityItems {
  const result: GroupedHeterogeneousEntityItems = {};

  for (const { entityId, document } of items) {
    const list = (result[entityId] ??= []);

    list.push(document);
  }

  return result;
}
