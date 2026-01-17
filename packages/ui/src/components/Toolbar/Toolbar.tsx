import type { ReactNode } from 'react';

import { classNames } from '../../utils/classNames';
import styles from './Toolbar.module.scss';

export interface ToolbarProps {
  className?: string;
  children?: ReactNode;
}

export function Toolbar({ className, children }: ToolbarProps) {
  return <div className={classNames(styles.root, className)}>{children}</div>;
}
