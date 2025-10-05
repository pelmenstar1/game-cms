import { ReactNode } from 'react';

import styles from './ModalOverlay.module.scss';
import { useScrollbar } from '../../hooks';
import { classNames } from '../../utils/classNames';

export type ModalOverlayEffect = 'tint' | 'blur';

export interface ModalOverlayProps {
  className?: string;
  effect?: ModalOverlayEffect;
  children?: ReactNode;
}

export function ModalOverlay({
  className,
  effect,
  children,
}: ModalOverlayProps) {
  useScrollbar(false);

  return (
    <div
      className={classNames(
        styles.root,
        styles[`root-effect-${effect}`],
        className
      )}
    >
      {children}
    </div>
  );
}
