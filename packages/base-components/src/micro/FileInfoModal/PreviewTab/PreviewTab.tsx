import { classNames } from '@game-cms/ui';

import { FileLargePreview } from '../../FileLargePreview/index.js';
import styles from './PreviewTab.module.scss';

export interface PreviewTabProps {
  className?: string;
  item: {
    mime: string;
    url: string;
  };
}

export function PreviewTab({ className, item }: PreviewTabProps) {
  return (
    <FileLargePreview
      className={classNames(styles.root, className)}
      mime={item.mime}
      url={item.url}
    />
  );
}
