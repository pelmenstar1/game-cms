import {
  classNames,
  IconButton,
  LegendToggleIcon,
  TransformView,
} from '@game-cms/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SpritesheetMap } from '../SpritesheetMap';
import { AtlasData } from '../types';
import styles from './ImagePart.module.scss';

export interface ImagePartProps {
  className?: string;
  imageUrl: string;
  atlasData?: AtlasData;
}

export function ImagePart({ className, imageUrl, atlasData }: ImagePartProps) {
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpritesheetPreviewModal.ImagePreview',
  });

  const [isMapDisplayed, setIsMapDisplayed] = useState(false);

  return (
    <div className={classNames(styles.root, className)}>
      <TransformView className={styles['transform-view']}>
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
