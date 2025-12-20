import { type Item, type ItemData, itemKey } from './types';

export function createItemData({
  item,
  index,
  instanceId,
}: {
  item: Item;
  index: number;
  instanceId: symbol;
}): ItemData {
  return {
    [itemKey]: true,
    item,
    index,
    instanceId,
  };
}

export function isItemData(
  data: Record<string | symbol, unknown>
): data is ItemData {
  return data[itemKey] === true;
}
