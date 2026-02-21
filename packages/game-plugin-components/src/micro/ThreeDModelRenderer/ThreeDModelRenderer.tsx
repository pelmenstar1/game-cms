import { createAbortController } from '@game-cms/shared';
import { classNames, useBounds } from '@game-cms/ui';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { Application, createApplication } from './app';
import styles from './ThreeDModelRenderer.module.scss';
import { BackgroundTheme, ModelStatus } from './types';

export * from './types';

export interface ThreeDModelRendererProps {
  className?: string;
  source: string;
  backgroundTheme?: BackgroundTheme;

  onModelStatusChanged?: (status: ModelStatus) => void;
}

export function ThreeDModelRenderer({
  className,
  source,
  backgroundTheme = 'light',
  onModelStatusChanged,
}: ThreeDModelRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  const onModelStatusChangedRef = useRef(onModelStatusChanged);

  // eslint-disable-next-line react-hooks/refs
  onModelStatusChangedRef.current = onModelStatusChanged;

  const size = useBounds(containerRef);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (container) {
      const app = createApplication();
      appRef.current = app;

      container.append(app.canvas);

      return () => {
        app.destroy();

        app.canvas.remove();
      };
    }
  }, []);

  useEffect(() => {
    appRef.current?.setSize(size.width, size.height);
  }, [size]);

  useEffect(() => {
    appRef.current?.setBackgroundTheme(backgroundTheme);
  }, [backgroundTheme]);

  useEffect(() => {
    const abortController = createAbortController();
    const app = appRef.current;

    if (app) {
      const worker = async () => {
        const onModelStatusChanged = onModelStatusChangedRef.current;

        try {
          const onProgress = (progress: number) => {
            onModelStatusChanged?.({ type: 'loading', progress });
          };

          await app.setModelSource(source, onProgress, abortController?.signal);

          onModelStatusChanged?.({ type: 'loaded' });
        } catch (error: unknown) {
          console.error(error);

          onModelStatusChanged?.({ type: 'error' });
        }
      };

      void worker();

      return () => {
        abortController?.abort();
      };
    }
  }, [onModelStatusChangedRef, source]);

  return (
    <div className={classNames(styles.root, className)} ref={containerRef} />
  );
}
