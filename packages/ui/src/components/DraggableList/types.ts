import type { Key, ReactNode, RefObject } from 'react';

export type ItemPosition = 'first' | 'last' | 'middle' | 'only';

export type CleanupFn = () => void;

export type Item = { key: Key };
export type ItemEntry = { itemId: Key; element: HTMLElement };

export const itemKey = Symbol('item');

export type ItemData = {
  [itemKey]: true;
  item: Item;
  index: number;
  instanceId: symbol;
};

export type DraggableState =
  | { type: 'idle' | 'dragging' }
  | { type: 'preview'; container: HTMLElement; rect: DOMRect };

export const idleState: DraggableState = { type: 'idle' };
export const draggingState: DraggableState = { type: 'dragging' };

export type RenderFn<T> = (
  value: T,
  index: number,
  handleRef?: RefObject<HTMLButtonElement | null>
) => ReactNode;
