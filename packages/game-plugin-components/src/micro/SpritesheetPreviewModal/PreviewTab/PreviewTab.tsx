import { classNames, useNotification, useTextFetch } from '@game-cms/ui';
import { useEffect, useState } from 'react';

import { spritesheetDataWithSize } from '../../../utils/spritesheet/schema';
import { AtlasPart } from './AtlasPart';
import { PreviewTabContextProvider } from './context';
import { ImagePart } from './ImagePart';
import styles from './PreviewTab.module.scss';
import { AtlasData } from './types';

export interface PreviewTabProps {
  className?: string;
  atlasUrl: string;
  imageUrl: string;
}

export function PreviewTab({ className, imageUrl, atlasUrl }: PreviewTabProps) {
  const atlasResult = useTextFetch(atlasUrl);
  const [atlasData, setAtlasData] = useState<AtlasData>();

  const notification = useNotification();

  useEffect(() => {
    if (atlasResult.status === 'success') {
      try {
        const atlasObject: unknown = JSON.parse(atlasResult.value);
        const parseResult = spritesheetDataWithSize.safeParse(atlasObject);

        if (parseResult.success) {
          setAtlasData({ raw: atlasResult.value, value: parseResult.data });
        } else {
          console.error(parseResult.error);

          notification.error('Failed to parse atlas data');
        }
      } catch (error) {
        console.error(error);

        notification.error('Failed to parse atlas JSON');
      }
    }
  }, [atlasResult, notification]);

  return (
    <PreviewTabContextProvider>
      <div className={classNames(styles.root, className)}>
        <ImagePart
          atlasData={atlasData}
          imageUrl={imageUrl}
          className={classNames(styles['part'], styles['image'])}
        />

        <AtlasPart
          atlasData={atlasData}
          imageUrl={imageUrl}
          className={classNames(styles['part'], styles['atlas'])}
        />
      </div>
    </PreviewTabContextProvider>
  );
}
