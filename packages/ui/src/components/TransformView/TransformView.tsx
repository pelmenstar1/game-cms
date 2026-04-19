import {
  type CSSProperties,
  type ReactNode,
  type Ref,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  type ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';

import { classNames } from '../../utils/classNames';
import styles from './TransformView.module.scss';

export type TransformViewHandle = {
  zoomToRect: (x: number, y: number, w: number, h: number) => void;
};

export interface TransformViewProps {
  ref?: Ref<TransformViewHandle>;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function TransformView({
  ref,
  className,
  style,
  children,
}: TransformViewProps) {
  const wrapperRef = useRef<ReactZoomPanPinchRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      zoomToRect(x, y, w, h) {
        const wrapper = wrapperRef.current;
        const container = containerRef.current;

        if (!wrapper || !container) {
          return;
        }

        const { width: cW, height: cH } = container.getBoundingClientRect();

        const scale = Math.min(cW / w, cH / h) * 0.8;
        const positionX = cW / 2 - (x + w / 2) * scale;
        const positionY = cH / 2 - (y + h / 2) * scale;

        wrapper.setTransform(positionX, positionY, scale, 300, 'easeOut');
      },
    }),
    []
  );

  return (
    <div
      ref={containerRef}
      className={classNames(styles.root, className)}
      style={style}
    >
      <TransformWrapper ref={wrapperRef} minScale={0.1}>
        {() => <TransformComponent>{children}</TransformComponent>}
      </TransformWrapper>
    </div>
  );
}
