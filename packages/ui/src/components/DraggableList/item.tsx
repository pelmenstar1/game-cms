import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
  type ElementDropTargetEventBasePayload,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { useListContext } from './context';
import styles from './item.module.scss';
import {
  type DraggableState,
  draggingState,
  idleState,
  type Item,
  type RenderFn,
} from './types';
import { createItemData, isItemData } from './utils';

interface ListItemProps<T extends Item> {
  item: T;
  index: number;
  render: RenderFn<T>;
}

export function ListItem<T extends Item>({
  item,
  index,
  render,
}: ListItemProps<T>) {
  const { instanceId } = useListContext();

  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLButtonElement>(null);

  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef.current;

    if (!element || !dragHandle) return;

    const data = createItemData({ item, index, instanceId });

    function onChange({ source, self }: ElementDropTargetEventBasePayload) {
      const isSource = source.element === dragHandle;
      if (isSource) {
        setClosestEdge(null);
        return;
      }

      const closestEdge = extractClosestEdge(self.data);

      const sourceIndex = source.data.index as number;

      const isItemBeforeSource = index === sourceIndex - 1;
      const isItemAfterSource = index === sourceIndex + 1;

      const isDropIndicatorHidden =
        (isItemBeforeSource && closestEdge === 'bottom') ||
        (isItemAfterSource && closestEdge === 'top');

      setClosestEdge(isDropIndicatorHidden ? null : closestEdge);
    }

    function onDragLeave() {
      setClosestEdge(null);
    }

    return combine(
      draggable({
        element: dragHandle,
        getInitialData: () => data,
        onGenerateDragPreview({ nativeSetDragImage, location }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.current.input,
            }),
            render({ container }) {
              setDraggableState({
                type: 'preview',
                container,
                rect: element.getBoundingClientRect(),
              });

              return () => {
                setDraggableState(draggingState);
              };
            },
          });
        },
        onDragStart() {
          setDraggableState(draggingState);
        },
        onDrop() {
          setDraggableState(idleState);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            isItemData(source.data) && source.data.instanceId === instanceId
          );
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDragEnter: onChange,
        onDrag: onChange,
        onDragLeave,
        onDrop: onDragLeave,
      })
    );
  }, [instanceId, item, index]);

  return (
    <>
      <div
        ref={ref}
        className={closestEdge ? styles[`edge-${closestEdge}`] : undefined}
      >
        {render(item, index, dragHandleRef)}
      </div>
      {draggableState.type === 'preview' &&
        ReactDOM.createPortal(
          <div
            style={{
              boxSizing: 'border-box',
              width: draggableState.rect.width,
              height: draggableState.rect.height,
            }}
          >
            {render(item, index)}
          </div>,
          draggableState.container
        )}
    </>
  );
}
