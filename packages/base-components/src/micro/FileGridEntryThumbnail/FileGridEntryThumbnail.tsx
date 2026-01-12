import { classNames, FolderIcon, UnknownDocumentIcon } from '@game-cms/ui';

import styles from './FileGridEntryThumbnail.module.scss';

export interface FileGridEntryThumbnailProps {
  className?: string;
  source: { type: 'folder' } | { type: 'file'; mime: string; url: string };
}

export function FileGridEntryThumbnail({
  className,
  source,
}: FileGridEntryThumbnailProps) {
  return source.type === 'folder' ? (
    <FolderIcon className={className} />
  ) : source.mime.startsWith('image/') ? (
    <img src={source.url} className={classNames(styles.image, className)} />
  ) : (
    <UnknownDocumentIcon className={className} />
  );
}
