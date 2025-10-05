import { FC, ReactNode, Ref, useEffect, useLayoutEffect, useRef } from 'react';

import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';
import styles from './InfiniteScroll.module.scss';
import { classNames } from '../../utils/classNames';

type LoadMarkerProps<T extends Element> = {
  ref?: Ref<T | null>;
  className?: string;
};

export type InfiniteScrollProps<T extends Element> = {
  className?: string;
  hasMoreElements?: boolean;

  loadMarker?: FC<LoadMarkerProps<T>>;

  onRequesNextPage: () => void;

  children: ReactNode;
};

function DefaultLoadMarker({ ref, className }: LoadMarkerProps<SVGSVGElement>) {
  return (
    <IndeterminateCircularProgress ref={ref} className={className} size="sm" />
  );
}

export function InfiniteScroll<T extends Element>({
  className,
  hasMoreElements = true,
  loadMarker,
  onRequesNextPage,
  children,
}: InfiniteScrollProps<T>) {
  const maxMarkerRef = useRef<Element>(null);

  const LoadMarker = loadMarker ?? DefaultLoadMarker;

  const stableRequestNextPage = useRef<(() => void) | null>(null);

  useEffect(() => {
    stableRequestNextPage.current = onRequesNextPage;
  }, [onRequesNextPage]);

  useEffect(() => {
    const { current: maxMarker } = maxMarkerRef;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (entry !== undefined && entry.isIntersecting) {
          stableRequestNextPage.current?.();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (maxMarker) {
      observer.observe(maxMarker);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const { current: maxMarker } = maxMarkerRef;

    if (maxMarker !== null) {
      const bounds = maxMarker.getBoundingClientRect();

      if (bounds.top <= window.innerHeight) {
        onRequesNextPage();
      }
    }
  }, [onRequesNextPage]);

  return (
    <div className={classNames(styles.root, className)}>
      {children}

      {hasMoreElements && (
        // @ts-expect-error the type is correct.
        <LoadMarker ref={maxMarkerRef} />
      )}
    </div>
  );
}
