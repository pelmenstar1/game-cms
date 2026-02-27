import {
  FilePreview,
  FilePreviewInputEntry,
  FilePreviewRenderer,
  PluginClientConfig,
} from '@game-cms/base-core';
import { createCachedFactorySelfKeyed } from '@game-cms/shared';
import { classNames, DataLoader, UnknownDocumentIcon } from '@game-cms/ui';
import React from 'react';

import { useClientConfig } from '../../hooks/useClientConfig.js';
import styles from './FileInlinePreview.module.scss';

export interface FileInlinePreviewProps extends FilePreviewInputEntry {
  className?: string;
}

type CachedPreviewProps = FilePreviewInputEntry & {
  config: PluginClientConfig;
};

const PREDEFINED_PREVIEWS: FilePreview[] = [
  {
    id: 'base::image',
    test: (entry) => entry.mime.startsWith('image/'),
    renderer: () => import('./Image/index.js'),
  },
  {
    id: 'base::audio',
    test: (entry) => entry.mime.startsWith('audio/'),
    renderer: () => import('./Audio/index.js'),
  },
];

function UnknownDocumentPreview() {
  return <UnknownDocumentIcon className={styles['unknown-document']} />;
}

const getCachedComponent = createCachedFactorySelfKeyed<
  FilePreviewRenderer,
  CachedPreviewProps
>((context) => {
  const previews = [
    ...(context.config.filePreviews?.inline ?? []),
    ...PREDEFINED_PREVIEWS,
  ];
  const target = previews.find((preview) => preview.test(context));

  if (target) {
    return { key: target.id, value: () => React.lazy(target.renderer) };
  }

  return {
    key: 'base::unknown',
    value: () => UnknownDocumentPreview,
  };
});

export function FileInlinePreviewContent(props: CachedPreviewProps) {
  const Component = getCachedComponent(props);

  return <Component {...props} />;
}

export function FileInlinePreview({
  className,
  mime,
  url,
}: FileInlinePreviewProps) {
  const clientConfigResult = useClientConfig();

  return (
    <DataLoader
      result={clientConfigResult}
      className={classNames(styles.root, className)}
    >
      {(clientConfig) => (
        <FileInlinePreviewContent config={clientConfig} mime={mime} url={url} />
      )}
    </DataLoader>
  );
}
