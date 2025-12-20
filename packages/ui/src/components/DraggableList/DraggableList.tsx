import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { useCallback, useEffect, useMemo } from 'react';

import { ListContext, type ListContextValue } from './context';
import { ListItem } from './item';
import type { Item, RenderFn } from './types';
import { isItemData } from './utils';

export interface DraggableListProps<T extends Item> {
  className?: string;
  disabled?: boolean;
  items: T[];
  onItemsChanged: (values: T[]) => void;
  children: RenderFn<T>;
}

export function DraggableList<T extends Item>({
  className,
  items,
  onItemsChanged,
  children,
}: DraggableListProps<T>) {
  const instanceId = useMemo(() => Symbol('instance-id'), []);

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: Edge | null;
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: 'vertical',
      });

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return;
      }

      onItemsChanged(
        reorder({
          list: items,
          startIndex,
          finishIndex,
        })
      );
    },
    [items, onItemsChanged]
  );

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isItemData(source.data) && source.data.instanceId === instanceId;
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;
        if (!isItemData(sourceData) || !isItemData(targetData)) {
          return;
        }

        const indexOfTarget = items.findIndex(
          (item) => item.key === targetData.item.key
        );
        if (indexOfTarget === -1) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        reorderItem({
          startIndex: sourceData.index,
          indexOfTarget,
          closestEdgeOfTarget,
        });
      },
    });
  }, [instanceId, items, reorderItem]);

  const getListLength = useCallback(() => items.length, [items.length]);

  const contextValue: ListContextValue = useMemo(() => {
    return {
      reorderItem,
      instanceId,
      getListLength,
    };
  }, [reorderItem, instanceId, getListLength]);

  return (
    <ListContext.Provider value={contextValue}>
      <div className={className}>
        {items.map((item, index) => (
          <ListItem
            key={item.key}
            item={item}
            index={index}
            render={children}
          />
        ))}
      </div>
    </ListContext.Provider>
  );
}
