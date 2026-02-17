import {
  classNames,
  IconButton,
  LegendToggleIcon,
  TransformView,
  useJsonFetch,
} from '@game-cms/ui';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { spritesheetDataWithSize } from '../../../utils/spritesheet/schema.js';
import { SpritesheetMap } from '../../SpritesheetMap';
import styles from './ImagePreview.module.scss';

export interface ImagePreviewProps {
  className?: string;
  imageUrl: string;
  atlasUrl: string;
}

export function ImagePreview({
  className,
  imageUrl,
  atlasUrl,
}: ImagePreviewProps) {
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpritesheetPreviewModal.ImagePreview',
  });

  const atlasResult = useJsonFetch(atlasUrl);

  const [isMapDisplayed, setIsMapDisplayed] = useState(false);

  const atlasData = useMemo(() => {
    if (atlasResult.status === 'success') {
      const parseResult = spritesheetDataWithSize.safeParse(atlasResult.value);

      if (parseResult.success) {
        return parseResult.data;
      }

      console.error(parseResult.error);
    }

    return null;
  }, [atlasResult]);

  return (
    <div className={classNames(styles.root, className)}>
      <TransformView>
        <div className={styles.content}>
          <img src={imageUrl} />
          {atlasData && isMapDisplayed && (
            <SpritesheetMap className={styles.map} spritesheet={atlasData} />
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
