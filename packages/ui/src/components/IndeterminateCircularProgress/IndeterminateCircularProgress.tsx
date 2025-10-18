import { ComponentProps } from 'react';

import { classNames } from '../../utils/classNames';
import styles from './IndeterminateCircularProgress.module.scss';

export interface IndeterminateCircularProgressProps
  extends ComponentProps<'svg'> {
  size?: 'sm' | 'md';
}

const STROKE_WIDTH = 3;
const RADIUS = 20;
const SIZE = (RADIUS + STROKE_WIDTH) * 2;
const VIEWBOX = `0 0 ${SIZE} ${SIZE}`;

export function IndeterminateCircularProgress({
  className,
  ref,
  size = 'sm',
  ...rest
}: IndeterminateCircularProgressProps) {
  return (
    <svg
      ref={ref}
      className={classNames(
        styles.root,
        styles[`root-size-${size}`],
        className
      )}
      viewBox={VIEWBOX}
      {...rest}
    >
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        strokeWidth={STROKE_WIDTH}
        strokeMiterlimit={5}
      />
    </svg>
  );
}
