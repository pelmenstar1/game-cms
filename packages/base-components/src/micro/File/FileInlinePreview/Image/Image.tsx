import { FilePreviewRendererProps } from '@game-cms/base-core';
import { classNames } from '@game-cms/ui';

import styles from './Image.module.scss';

type ImageProps = FilePreviewRendererProps;

export function Image({ className, url }: ImageProps) {
  return <img src={url} className={classNames(styles.root, className)} />;
}
