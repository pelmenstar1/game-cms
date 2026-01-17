import type { CSSProperties, ReactNode } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { classNames } from '../../utils/classNames';
import styles from './TransformView.module.scss';

export interface TransformViewProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function TransformView({
  className,
  style,
  children,
}: TransformViewProps) {
  return (
    <div className={classNames(styles.root, className)} style={style}>
      <TransformWrapper minScale={0.1}>
        {() => <TransformComponent>{children}</TransformComponent>}
      </TransformWrapper>
    </div>
  );
}
