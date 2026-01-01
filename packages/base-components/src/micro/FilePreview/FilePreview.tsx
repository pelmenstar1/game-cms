import { classNames, UnknownDocumentIcon } from '@game-cms/ui';

import styles from './FilePreview.module.scss';

export interface FilePreviewProps {
  className?: string;
  mime: string;
  url: string;
}

function getContent(mime: string, url: string) {
  if (mime.startsWith('image/')) {
    return <img src={url} className={styles.image} />;
  }

  if (mime.startsWith('audio/')) {
    return <audio src={url} className={styles.audio} controls />;
  }

  return <UnknownDocumentIcon />;
}

export function FilePreview({ className, mime, url }: FilePreviewProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {getContent(mime, url)}
    </div>
  );
}
