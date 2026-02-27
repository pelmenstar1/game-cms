import { DefaultExport } from '@game-cms/shared';
import { FC } from 'react';

export type FilePreviewInputEntry = {
  mime: string;
  url: string;
};

export interface FilePreviewRendererProps extends FilePreviewInputEntry {
  className?: string;
}

export type FilePreviewRenderer = FC<FilePreviewRendererProps>;

export type FilePreview = {
  id: string;
  test: (entry: FilePreviewInputEntry) => boolean;
  renderer: () => Promise<DefaultExport<FilePreviewRenderer>>;
};

declare module './plugin.js' {
  interface OwnPluginClientConfig {
    filePreviews?: {
      inline?: FilePreview[];
      fullScale?: FilePreview[];
    };
  }
}
