import {
  FilePreview,
  FilePreviewInputEntry,
  PluginClientConfig,
} from '@game-cms/base-core';
import { createCachedFactorySelfKeyed } from '@game-cms/shared';
import { DataLoader } from '@game-cms/ui';
import React, { FC } from 'react';

import { useClientConfig } from '../../hooks/useClientConfig.js';
import { FileInlinePreviewContent } from '../FileInlinePreview/index.js';

export interface FileBigPreviewProps {
  className?: string;
  mime: string;
  url: string;
}

type CachedPreviewProps = FilePreviewInputEntry & {
  config: PluginClientConfig;
};

const PREDEFINED_PREVIEWS: FilePreview[] = [
  {
    id: 'base::application/json',
    test: (entry) => entry.mime === 'application/json',
    renderer: () => import('./components/Json/index.js'),
  },
  {
    id: 'base::text/plain',
    test: (entry) => entry.mime === 'text/plain',
    renderer: () => import('./components/Text/index.js'),
  },
];

const getCachedComponent = createCachedFactorySelfKeyed<
  FC<CachedPreviewProps>,
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
    key: 'base::inline',
    value: () => FileInlinePreviewContent,
  };
});

export function FileBigPreviewContent(props: CachedPreviewProps) {
  const Component = getCachedComponent(props);

  return <Component {...props} />;
}

export function FileBigPreview({ className, mime, url }: FileBigPreviewProps) {
  const clientConfigResult = useClientConfig();

  return (
    <DataLoader result={clientConfigResult} className={className}>
      {(clientConfig) => (
        <FileBigPreviewContent config={clientConfig} mime={mime} url={url} />
      )}
    </DataLoader>
  );
}
