import { createAbortController } from '@game-cms/shared';
import { classNames, useBounds } from '@game-cms/ui';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { Application, createApplication } from './app';
import { LightingType } from './constants';
import styles from './ThreeDModelRenderer.module.scss';
import { AnimationInfo, BackgroundTheme, ModelStatus } from './types';

export interface ThreeDModelRendererProps {
  className?: string;
  source: string;
  backgroundTheme?: BackgroundTheme;
  lightingType?: LightingType;
  activeClipIndex?: number;
  isPlaying?: boolean;
  autoRotate?: boolean;
  seekTarget?: { value: number };

  onModelStatusChanged?: (status: ModelStatus) => void;
  onAnimationsLoaded?: (animations: AnimationInfo[]) => void;
  onAnimationTimeUpdate?: (time: number) => void;
}

export function ThreeDModelRenderer({
  className,
  source,
  backgroundTheme = 'light',
  lightingType = 'directional',
  activeClipIndex,
  isPlaying = false,
  autoRotate = false,
  seekTarget,
  onModelStatusChanged,
  onAnimationsLoaded,
  onAnimationTimeUpdate,
}: ThreeDModelRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  const onModelStatusChangedRef = useRef(onModelStatusChanged);
  const onAnimationsLoadedRef = useRef(onAnimationsLoaded);
  const onAnimationTimeUpdateRef = useRef(onAnimationTimeUpdate);
  const isPlayingRef = useRef(isPlaying);

  // eslint-disable-next-line react-hooks/refs
  onModelStatusChangedRef.current = onModelStatusChanged;
  // eslint-disable-next-line react-hooks/refs
  onAnimationsLoadedRef.current = onAnimationsLoaded;
  // eslint-disable-next-line react-hooks/refs
  onAnimationTimeUpdateRef.current = onAnimationTimeUpdate;
  // eslint-disable-next-line react-hooks/refs
  isPlayingRef.current = isPlaying;

  const size = useBounds(containerRef);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (container) {
      const app = createApplication();
      appRef.current = app;

      app.setOnTimeUpdate((time) => {
        onAnimationTimeUpdateRef.current?.(time);
      });

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
    appRef.current?.setLightingType(lightingType);
  }, [lightingType]);

  useEffect(() => {
    if (activeClipIndex !== undefined && activeClipIndex >= 0) {
      appRef.current?.playAnimation(activeClipIndex, isPlayingRef.current);
    }
    // isPlayingRef intentionally excluded — it's a ref, not reactive state
  }, [activeClipIndex]);

  useEffect(() => {
    if (isPlaying) {
      appRef.current?.resumeAnimation();
    } else {
      appRef.current?.pauseAnimation();
    }
  }, [isPlaying]);

  useEffect(() => {
    appRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);

  useEffect(() => {
    if (seekTarget !== undefined) {
      appRef.current?.seekAnimation(seekTarget.value);
    }
  }, [seekTarget]);

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

          const animations = await app.setModelSource(
            source,
            onProgress,
            abortController?.signal
          );

          onAnimationsLoadedRef.current?.(animations);
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
