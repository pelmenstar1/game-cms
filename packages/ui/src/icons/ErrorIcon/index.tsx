import { classNames } from '../../utils/classNames';
import type { SvgProps } from '../types';
import styles from './index.module.scss';

export function ErrorIcon({ className, ...rest }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={classNames(styles.root, className)}
      {...rest}
    >
      <path
        d="M12 8V12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16.0195V16"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
