import { FilePreviewRendererProps } from '@game-cms/base-core';
import { classNames } from '@game-cms/ui';

import styles from './Audio.module.scss';

export function Audio({ className, url }: FilePreviewRendererProps) {
  return (
    <audio src={url} className={classNames(styles.root, className)} controls />
  );
}
