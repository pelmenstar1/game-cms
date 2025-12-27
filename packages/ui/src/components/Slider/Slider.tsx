import { clampNumber, lerp } from '@game-cms/shared';
import {
  type ComponentProps,
  type PointerEvent,
  useRef,
  useState,
} from 'react';

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

  const [downPointerId, setDownPointerId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerBounds = useBounds(containerRef);

  const handleThumbMove = (clientX: number) => {
    const dx = clientX - containerBounds.left;
    const newProgress = clampNumber(0, 1, dx / containerBounds.width);
    const newValue = lerp(min, max, newProgress);

    onValueChanged?.(newValue);
  };

  const onThumbPointerDown = (event: PointerEvent) => {
    if (downPointerId === null) {
      setDownPointerId(event.pointerId);
      handleThumbMove(event.clientX);

      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onThumbPointerMove = (event: PointerEvent) => {
    if (downPointerId === event.pointerId) {
      handleThumbMove(event.clientX);
    }
  };

  const onThumbPointerUp = (event: PointerEvent) => {
    if (downPointerId === event.pointerId) {
      setDownPointerId(null);

      event.currentTarget.releasePointerCapture(downPointerId);
    }
  };

  return (
    <div
      className={classNames(styles.root, className)}
      ref={containerRef}
      style={{ ['--progress']: progress.toFixed(3), ...style }}
      onPointerDown={onThumbPointerDown}
      onPointerUp={onThumbPointerUp}
      onPointerMove={onThumbPointerMove}
      {...rest}
    >
      <div className={styles.track} />
      <div
        draggable={false}
        className={classNames(
          styles.thumb,
          downPointerId !== null && styles['thumb-active']
        )}
      />
    </div>
  );
}
