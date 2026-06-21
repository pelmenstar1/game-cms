import { type Rect, rectsIntersect } from '@game-cms/shared';
import {
  type ComponentProps,
  type PointerEvent,
  useCallback,
  useRef,
} from 'react';

import { useBounds } from '../../hooks';
import { classNames } from '../../utils/classNames';
import styles from './SelectionGrid.module.scss';

type TouchInfo = {
  pointerId: number;
  x: number;
  y: number;
};

export interface SelectionGridProps extends ComponentProps<'div'> {
  onSelectionChanged?: (items: number[]) => void;
  disabled?: boolean;
}

export function SelectionGrid({
  className,
  onSelectionChanged,
  children,
  disabled,
  ...rest
}: SelectionGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  const containerBounds = useBounds(ref);
  const childrenBounds = useRef<DOMRect[]>([]);

  const initialTouch = useRef<TouchInfo>(null);

  const onPointerDown = useCallback(
    (event: PointerEvent) => {
      if (initialTouch.current === null) {
        initialTouch.current = {
          pointerId: event.pointerId,
          x: event.clientX - containerBounds.left,
          y: event.clientY - containerBounds.top,
        };

        event.currentTarget.setPointerCapture(event.pointerId);

        const container = ref.current;
        if (container) {
          const { style, childNodes } = container;

          style.setProperty('--selection-content', "''");
          style.setProperty('--x', '0');
          style.setProperty('--y', '0');
          style.setProperty('--width', '0');
          style.setProperty('--height', '0');

          const boundsList: DOMRect[] = Array.from(childNodes, (child) =>
            (child as HTMLElement).getBoundingClientRect()
          );

          childrenBounds.current = boundsList;
        }
      }
    },
    [containerBounds.left, containerBounds.top]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const startTouch = initialTouch.current;

      if (startTouch !== null) {
        const currentX = event.clientX - containerBounds.left;
        const currentY = event.clientY - containerBounds.top;

        const minX = Math.min(currentX, startTouch.x);
        const maxX = Math.max(currentX, startTouch.x);

        const minY = Math.min(currentY, startTouch.y);
        const maxY = Math.max(currentY, startTouch.y);

        const style = ref.current?.style;
        if (style) {
          style.setProperty('--x', (minX / containerBounds.width).toFixed(4));
          style.setProperty('--y', (minY / containerBounds.height).toFixed(4));
          style.setProperty(
            '--width',
            ((maxX - minX) / containerBounds.width).toFixed(4)
          );
          style.setProperty(
            '--height',
            ((maxY - minY) / containerBounds.height).toFixed(4)
          );
        }

        const selectionRect: Rect = {
          left: minX + containerBounds.left,
          top: minY + containerBounds.top,
          right: maxX + containerBounds.left,
          bottom: maxY + containerBounds.top,
        };

        const selectedIndices: number[] = [];

        const cBoundsList = childrenBounds.current;
        for (let i = 0; i < cBoundsList.length; i++) {
          const cBounds = cBoundsList[i];

          if (rectsIntersect(cBounds, selectionRect)) {
            selectedIndices.push(i);
          }
        }

        onSelectionChanged?.(selectedIndices);
      }
    },
    [containerBounds, onSelectionChanged]
  );

  const onPointerUp = useCallback((event: PointerEvent) => {
    if (initialTouch.current?.pointerId === event.pointerId) {
      const style = ref.current?.style;
      if (style) {
        style.setProperty('--selection-content', null);
        style.setProperty('--x', null);
        style.setProperty('--y', null);
        style.setProperty('--width', null);
        style.setProperty('--height', null);

        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      initialTouch.current = null;
    }
  }, []);

  return (
    <div
      className={classNames(styles.root, className)}
      {...rest}
      ref={ref}
      onPointerDown={disabled ? undefined : onPointerDown}
      onPointerMove={disabled ? undefined : onPointerMove}
      onPointerUp={disabled ? undefined : onPointerUp}
    >
      {children}
    </div>
  );
}
