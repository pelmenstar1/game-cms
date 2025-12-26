import { clampNumber, lerp } from '@game-cms/shared';
import { type ComponentProps, type PointerEvent, useRef } from 'react';

import { useBounds } from '../../hooks';
import { classNames } from '../../utils/classNames';
import styles from './Slider.module.scss';

export interface SliderProps extends Omit<ComponentProps<'div'>, 'children'> {
  className?: string;
  min: number;
  max: number;
  value: number;

  onValueChanged?: (value: number) => void;
}

export function Slider({
  className,
  style,
  min,
  max,
  value,
  onValueChanged,
  ...rest
}: SliderProps) {
  const progress = clampNumber(min, max, value) / (max - min);

  const downPointerIdRef = useRef<number>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerBounds = useBounds(containerRef);

  const onPointerDown = (event: PointerEvent) => {
    if (downPointerIdRef.current === null) {
      downPointerIdRef.current = event.pointerId;

      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    if (downPointerIdRef.current === event.pointerId) {
      const dx = event.clientX - containerBounds.left;
      const newProgress = clampNumber(0, 1, dx / containerBounds.width);

      const newValue = lerp(min, max, newProgress);

      onValueChanged?.(newValue);
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    const downPointer = downPointerIdRef.current;

    if (downPointer === event.pointerId) {
      downPointerIdRef.current = null;

      event.currentTarget.releasePointerCapture(downPointer);
    }
  };

  return (
    <div
      className={classNames(styles.root, className)}
      ref={containerRef}
      style={{ ['--progress']: progress.toFixed(3), ...style }}
      {...rest}
    >
      <div className={styles.track} />
      <div
        className={styles.thumb}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
      />
    </div>
  );
}
