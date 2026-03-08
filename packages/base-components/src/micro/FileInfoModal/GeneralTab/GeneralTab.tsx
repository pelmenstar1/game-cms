import { classNames, Prefixed } from '@game-cms/ui';

import { FileInfo } from '../types.js';
import styles from './GeneralTab.module.scss';
import { getImageSize } from './utils.js';

export interface GeneralTabProps {
  className?: string;
  item: FileInfo;
}

export function GeneralTab({ className, item }: GeneralTabProps) {
  const imageSize = getImageSize(item.addons);

  return (
    <div className={classNames(styles.root, className)}>
      <Prefixed value="Internal ID">{item.id}</Prefixed>
      <Prefixed value="Name">{item.name}</Prefixed>
      <Prefixed value="URL">{item.url}</Prefixed>
      <Prefixed value="Mime type">{item.mime}</Prefixed>

      {imageSize && (
        <>
          <Prefixed value="Width">{imageSize.width}</Prefixed>
          <Prefixed value="Height">{imageSize.height}</Prefixed>
        </>
      )}
    </div>
  );
}
