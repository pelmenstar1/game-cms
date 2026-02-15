import { Size } from '@game-cms/shared';
import { classNames, useBounds, useNotification } from '@game-cms/ui';
import { Application } from 'pixi.js';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './PixiScene.module.scss';

type AbstractScene = {
  pixiApp: Application;
  setSize: (size: Size) => void;
};

export interface PixiSceneProps<Scene extends AbstractScene> extends Omit<
  ComponentProps<'div'>,
  'ref' | 'children'
> {
  className?: string;

  sceneLoader: () => Promise<Scene>;
  onSceneLoaded: (scene: Scene) => void;
}

export function PixiScene<Scene extends AbstractScene>({
  className,
  sceneLoader,
  onSceneLoaded,
}: PixiSceneProps<Scene>) {
  const [scene, setScene] = useState<Scene | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const size = useBounds(containerRef);

  const notification = useNotification();

  const { t } = useTranslation('game', {
    keyPrefix: 'micro.PixiScene',
  });

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      let currentScene: Scene | undefined;

      sceneLoader()
        .then((scene) => {
          currentScene = scene;

          setScene(scene);
          onSceneLoaded(scene);

          container.replaceChildren(scene.pixiApp.canvas);
        })
        .catch((error: unknown) => {
          console.error(error);

          notification.error(t('sceneFailed'));
        });

      return () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        container.childNodes[0]?.remove();

        currentScene?.pixiApp.destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  useEffect(() => {
    scene?.setSize(size);
  }, [scene, size]);

  return (
    <div ref={containerRef} className={classNames(className, styles.root)} />
  );
}
