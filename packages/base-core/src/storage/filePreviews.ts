import { DefaultExport } from '@game-cms/shared';
import { FC } from 'react';

export interface FilePreviewInputEntry {
  mime: string;
  url: string;
}

export interface NamedFilePreviewInputEntry extends FilePreviewInputEntry {
  name: string;
}

export interface FilePreviewRendererProps extends FilePreviewInputEntry {
  className?: string;
}

export type FilePreviewRenderer = FC<FilePreviewRendererProps>;

export type FileGroupPreviewRenderer<Props> = FC<Props>;

export type AsyncFileGroupPreviewRenderer<Props> = () => Promise<
  DefaultExport<FileGroupPreviewRenderer<Props>>
>;

export type FilePreview = {
  id: string;
  test: (entry: FilePreviewInputEntry) => boolean;
  renderer: () => Promise<DefaultExport<FilePreviewRenderer>>;
};

export type FileGroupPreview<Props = unknown> = {
  id: string;
  test: (items: NamedFilePreviewInputEntry[]) => Props | undefined;
  renderer: AsyncFileGroupPreviewRenderer<Props>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFileGroupPreview = FileGroupPreview<any>;

declare module '../plugin.js' {
  interface OwnPluginClientConfig {
    filePreviews?: {
      inline?: FilePreview[];
      fullScale?: FilePreview[];
      group?: AnyFileGroupPreview[];
    };
  }
}

export function fileGroupPreview<Props>(value: FileGroupPreview<Props>) {
  return value;
}
