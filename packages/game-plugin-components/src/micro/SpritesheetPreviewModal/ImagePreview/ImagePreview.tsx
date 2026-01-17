import { classNames, useJsonFetch } from '@game-cms/ui';
import { useMemo } from 'react';

import { SpritesheetMap } from '../../SpritesheetMap';
import { spritesheetDataWithSize } from '../../SpritesheetMap/schema';
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
  const atlasResult = useJsonFetch(atlasUrl);

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
      <img src={imageUrl} />
      {atlasData && (
        <SpritesheetMap className={styles.map} spritesheet={atlasData} />
      )}
    </div>
  );
}
