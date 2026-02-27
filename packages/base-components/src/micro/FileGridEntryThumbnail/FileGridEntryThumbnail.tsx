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
  if (source.type === 'folder') {
    return <FolderIcon className={className} />;
  }

  if (source.mime.startsWith('image/')) {
    return (
      <img src={source.url} className={classNames(styles.image, className)} />
    );
  }

  return <UnknownDocumentIcon className={className} />;
}
