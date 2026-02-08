import { clampNumber } from '@game-cms/shared';
import { type ComponentProps } from 'react';

import { classNames } from '../../utils/classNames';
import styles from './CircularProgress.module.scss';

export interface CircularProgressProps extends ComponentProps<'svg'> {
  progress: number;
  size?: 'sm' | 'md';
}

const STROKE_WIDTH = 3;
const RADIUS = 20;
const SIZE = (RADIUS + STROKE_WIDTH) * 2;
const VIEW_BOX = `0 0 ${SIZE} ${SIZE}`;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CircularProgress({
  className,
  ref,
  progress,
  size = 'sm',
  ...rest
}: CircularProgressProps) {
  const clampedProgress = clampNumber(progress, 0, 1);
  const dashOffset = CIRCUMFERENCE * (1 - clampedProgress);

  return (
    <svg
      ref={ref}
      className={classNames(
        styles.root,
        styles[`root-size-${size}`],
        className
      )}
      viewBox={VIEW_BOX}
      {...rest}
    >
      <circle
        className={styles.track}
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        strokeWidth={STROKE_WIDTH}
      />
      <circle
        className={styles.indicator}
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}
