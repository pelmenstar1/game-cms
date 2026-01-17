import { classNames, useBounds, useNotification } from '@game-cms/ui';
import {
  type ComponentProps,
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { createSpineApplication, type SpineApplication } from './app.js';
import styles from './SpineRenderer.module.scss';
import type { SpineData } from './types.js';

export type SpineRendererRefType = {
  setTime: (relativeTime: number) => void;
};

export interface SpineRendererProps extends Omit<
  ComponentProps<'div'>,
  'ref' | 'children'
> {
  ref?: Ref<SpineRendererRefType>;
  speed?: number;
  spine: SpineData;
  animation?: string;
  isRunning?: boolean;

  onAnimationsLoaded?: (names: string[]) => void;
  onAnimationTimeChanged?: (time: number) => void;
}

export function SpineRenderer({
  ref,
  className,
  spine,
  animation,
  isRunning = true,
  speed = 1,
  onAnimationsLoaded,
  onAnimationTimeChanged,
  ...rest
}: SpineRendererProps) {
  const notification = useNotification();
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpineRenderer',
  });

  const [app, setApp] = useState<SpineApplication | null>(null);
  const [isSpineLoaded, setSpineLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const size = useBounds(containerRef);

  useImperativeHandle(
    ref,
    () => ({
      setTime: (time) => {
        app?.setTime(time);
      },
    }),
    [app]
  );

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      let currentApp: SpineApplication | undefined;

      createSpineApplication()
        .then((app) => {
          currentApp = app;
          setApp(app);

          container.replaceChildren(app.pixiApp.canvas);
        })
        .catch((error: unknown) => {
          console.error(error);

          notification.error(t('sceneFailed'));
        });

      return () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        container.childNodes[0]?.remove();

        currentApp?.destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  useEffect(() => {
    app
      ?.setSpine(spine)
      .then(() => {
        setSpineLoaded(true);
      })
      .catch((error: unknown) => {
        console.error(error);

        notification.error(t('spineFailed'));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app, notification, spine]);

  useEffect(() => {
    app?.setSize(size);
  }, [app, size]);

  useEffect(() => {
    app?.setAnimation(animation);
  }, [app, animation]);

  useEffect(() => {
    app?.setAnimationRunning(isRunning);
  }, [app, isRunning]);

  useEffect(() => {
    app?.setOnAnimationTimeChanged(onAnimationTimeChanged);
  }, [app, onAnimationTimeChanged]);

  useEffect(() => {
    app?.setSpeed(speed);
  }, [app, speed]);

  useEffect(() => {
    if (app && isSpineLoaded) {
      onAnimationsLoaded?.(app.getAnimations());
    }
  }, [app, isSpineLoaded, onAnimationsLoaded]);

  return (
    <div
      ref={containerRef}
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
