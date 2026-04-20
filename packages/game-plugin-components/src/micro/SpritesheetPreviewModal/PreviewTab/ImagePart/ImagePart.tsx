import {
  classNames,
  IconButton,
  LegendToggleIcon,
  TransformView,
  type TransformViewHandle,
} from '@game-cms/ui';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePreviewTabContext } from '../context';
import { SpritesheetMap } from '../SpritesheetMap';
import { AtlasData } from '../types';
import styles from './ImagePart.module.scss';

export interface ImagePartProps {
  className?: string;
  imageUrl: string;
  atlasData?: AtlasData;
}

export function ImagePart({ className, imageUrl, atlasData }: ImagePartProps) {
  const { pinnedFrame } = usePreviewTabContext();
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpritesheetPreviewModal.ImagePreview',
  });

  const transformRef = useRef<TransformViewHandle>(null);
  const [isMapDisplayed, setIsMapDisplayed] = useState(false);

  useEffect(() => {
    const transformView = transformRef.current;

    if (!pinnedFrame || !atlasData || !transformView) {
      return;
    }

    const frameData = atlasData.value.frames[pinnedFrame];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (frameData) {
      const { x, y, w, h } = frameData.frame;

      transformView.zoomToRect(x, y, w, h);
    }
  }, [pinnedFrame, atlasData]);

  return (
    <div className={classNames(styles.root, className)}>
      <TransformView ref={transformRef} className={styles['transform-view']}>
        <div className={styles.content}>
          <img className={styles.image} src={imageUrl} />
          {atlasData && (
            <SpritesheetMap
              className={styles.map}
              spritesheet={atlasData.value}
              displayAllFrames={isMapDisplayed}
            />
          )}
        </div>
      </TransformView>

      <IconButton
        className={styles['toggle-map']}
        title={t('toggleMap')}
        onClick={() => {
          setIsMapDisplayed((prev) => !prev);
        }}
      >
        <LegendToggleIcon />
      </IconButton>
    </div>
  );
}
