import { classNames, useTextFetch } from '@game-cms/ui';
import { useMemo } from 'react';

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

  const atlasData = useMemo((): AtlasData | undefined => {
    if (atlasResult.status === 'success') {
      const atlasObject: unknown = JSON.parse(atlasResult.value);
      const parseResult = spritesheetDataWithSize.safeParse(atlasObject);

      if (parseResult.success) {
        return { raw: atlasResult.value, value: parseResult.data };
      }

      console.error(parseResult.error);
    }
  }, [atlasResult]);

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
          className={classNames(styles['part'], styles['atlas'])}
        />
      </div>
    </PreviewTabContextProvider>
  );
}
