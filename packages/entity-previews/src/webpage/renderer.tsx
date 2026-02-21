import { EntityId, EntityPreviewRendererProps } from '@game-cms/base-core';
import { createAbortController } from '@game-cms/shared';
import {
  DataLoader,
  IconButton,
  RefreshIcon,
  Typography,
  useAbstractQueryResult,
} from '@game-cms/ui';
import { useRef } from 'react';

import styles from './renderer.module.scss';
import { WebpageEntityPreviewOptions } from './types.js';

type PageViewProps = {
  url: string;
};

function PageView({ url }: PageViewProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const onRefresh = () => {
    const frame = frameRef.current;

    if (frame) {
      // Setting src refreshes the frame even if it's the same
      // eslint-disable-next-line no-self-assign
      frame.src = frame.src;
    }
  };

  return (
    <div className={styles['page-view']}>
      <div className={styles['header']}>
        <Typography className={styles['header-url']} title={url}>
          {url}
        </Typography>

        <IconButton title="Refresh" onClick={onRefresh}>
          <RefreshIcon />
        </IconButton>
      </div>

      <iframe ref={frameRef} src={url} className={styles['frame']} />
    </div>
  );
}

export const renderer = <Id extends EntityId>({
  data,
  entityId,
  objectId,
  previewOptions: { urlSource },
}: EntityPreviewRendererProps<Id, WebpageEntityPreviewOptions>) => {
  const result = useAbstractQueryResult(() => {
    const abortController = createAbortController();

    const worker = async () => {
      return urlSource({
        data,
        entityId,
        objectId,
        abortSignal: abortController?.signal,
      });
    };

    return {
      promise: worker(),
      cleanup: () => {
        abortController?.abort();
      },
    };
  });

  return (
    <DataLoader result={result} className={styles['root']}>
      {(url) => <PageView url={url} />}
    </DataLoader>
  );
};
