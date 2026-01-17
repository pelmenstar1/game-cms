import type { CSSProperties } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { classNames } from '../../utils/classNames';
import styles from './ImageView.module.scss';

export interface ImageViewProps {
  className?: string;
  style?: CSSProperties;
  src: string;
}

export function ImageView({ className, style, src }: ImageViewProps) {
  return (
    <div className={classNames(styles.root, className)} style={style}>
      <TransformWrapper minScale={0.1}>
        {() => (
          <TransformComponent>
            <img src={src} />
          </TransformComponent>
        )}
      </TransformWrapper>
    </div>
  );
}
