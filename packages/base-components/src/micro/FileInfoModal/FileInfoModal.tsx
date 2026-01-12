import { StorageFileItem } from '@game-cms/base-core';
import { ToClientType } from '@game-cms/core';
import { ModalDialog, ModalProps, Prefixed } from '@game-cms/ui';

import { FileBigPreview } from '../FileBigPreview/FileBigPreview.js';
import styles from './FileInfoModal.module.scss';

export interface FileInfoModalProps extends ModalProps {
  item: ToClientType<StorageFileItem & { id: string }>;
}

export function FileInfoModal({ item, onClose }: FileInfoModalProps) {
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
      </div>
    </ModalDialog>
  );
}
