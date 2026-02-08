import { classNames, useBounds, useStableValue } from '@game-cms/ui';
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

  const stableOnModelStatusChanged = useStableValue(onModelStatusChanged);

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
    const worker = async () => {
      try {
        await appRef.current?.setModelSource(source, (progress) => {
          stableOnModelStatusChanged?.({ type: 'loading', progress });
        });

        stableOnModelStatusChanged?.({ type: 'loaded' });
      } catch (error: unknown) {
        console.error(error);

        stableOnModelStatusChanged?.({ type: 'error' });
      }
    };

    void worker();
  }, [stableOnModelStatusChanged, source]);

  return (
    <div className={classNames(styles.root, className)} ref={containerRef} />
  );
}
