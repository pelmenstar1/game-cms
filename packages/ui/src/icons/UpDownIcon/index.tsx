import { classNames } from '../../utils/classNames';
import type { SvgProps } from '../types';
import styles from './index.module.scss';

export interface UpDownIconProps extends SvgProps {
  isUp?: boolean;
}

export function UpDownIcon({ isUp, className, ...rest }: UpDownIconProps) {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 -960 960 960"
      className={classNames(styles.root, isUp && styles['root-up'], className)}
      {...rest}
    >
      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
  );
}
