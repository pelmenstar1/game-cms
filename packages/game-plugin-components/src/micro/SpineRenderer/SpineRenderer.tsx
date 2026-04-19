import { classNames, useNotification } from '@game-cms/ui';
import {
  type ComponentProps,
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  type ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';

import { PixiScene } from '../PixiScene';
import { createSpineApplication, type SpineApplication } from './app.js';
import styles from './SpineRenderer.module.scss';
import type { OnAnimationTimeChanged, SpineData } from './types.js';

export type SpineRendererRefType = {
  setTime: (relativeTime: number) => void;
  exportFrame: () => Promise<Blob | null>;
  fit: () => void;
};

export interface SpineRendererProps extends Omit<
  ComponentProps<'div'>,
  'ref' | 'children'
> {
  ref?: Ref<SpineRendererRefType>;
  speed?: number;
  spine: SpineData;
  animation?: string;
  skin?: string;
  loop?: boolean;
  isRunning?: boolean;

  onAnimationsLoaded?: (names: string[]) => void;
  onSkinsLoaded?: (names: string[]) => void;
  onAnimationTimeChanged?: OnAnimationTimeChanged;
}

export function SpineRenderer({
  ref,
  className,
  spine,
  animation,
  skin,
  loop = true,
  isRunning = true,
  speed = 1,
  onAnimationsLoaded,
  onSkinsLoaded,
  onAnimationTimeChanged,
  ...rest
}: SpineRendererProps) {
  const notification = useNotification();
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpineRenderer',
  });

  const [app, setApp] = useState<SpineApplication | null>(null);
  const [isSpineLoaded, setSpineLoaded] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  useImperativeHandle(
    ref,
    () => ({
      setTime: (time) => {
        app?.setTime(time);
      },
      exportFrame: async () => {
        if (app) {
          return app.exportFrame();
        }

        return null;
      },
      fit: () => {
        transformRef.current?.resetTransform();
      },
    }),
    [app]
  );

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
    app?.setAnimation(animation);
  }, [app, animation]);

  useEffect(() => {
    app?.setSkin(skin);
  }, [app, skin]);

  useEffect(() => {
    app?.setLoop(loop);
  }, [app, loop]);

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
      onSkinsLoaded?.(app.getSkins());
    }
  }, [app, isSpineLoaded, onAnimationsLoaded, onSkinsLoaded]);

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <TransformWrapper ref={transformRef} minScale={0.1} maxScale={10}>
        <TransformComponent
          wrapperClass={styles['transform-wrapper']}
          contentClass={styles['transform-content']}
        >
          <PixiScene
            className={styles.scene}
            sceneLoader={createSpineApplication}
            onSceneLoaded={setApp}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
