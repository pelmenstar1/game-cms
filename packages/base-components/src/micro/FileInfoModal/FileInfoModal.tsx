import { isNonNullObject } from '@game-cms/shared';
import { UnknownObject } from '@game-cms/shared/object';
import { ModalDialog, ModalProps, Prefixed } from '@game-cms/ui';

import { FileBigPreview } from '../FileBigPreview/FileBigPreview.js';
import styles from './FileInfoModal.module.scss';

export interface FileInfoModalProps extends ModalProps {
  item: {
    name: string;
    url: string;
    id: string;
    mime: string;
    addons: Record<string, unknown>;
  };
}

function getImageSize(addons: Record<string, unknown>) {
  const { imageSize } = addons;

  if (isNonNullObject(imageSize)) {
    const { width, height } = imageSize as UnknownObject;

    if (typeof width === 'number' && typeof height === 'number') {
      return { width, height };
    }
  }
}

export function FileInfoModal({ item, onClose }: FileInfoModalProps) {
  const imageSize = getImageSize(item.addons);

  return (
    <ModalDialog onClose={onClose} contentClassName={styles.content}>
      <FileBigPreview
        className={styles.preview}
        mime={item.mime}
        url={item.url}
      />

      <div className={styles.info}>
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
    </ModalDialog>
  );
}
