import { FileDropArea, ModalDialog, type ModalProps } from '@game-cms/ui';

import styles from './UploadFileDialog.module.scss';

export interface UploadFileDialogProps extends ModalProps<File[] | undefined> {
  supportedMimeTypes?: string[];
}

export function UploadFileDialog({
  supportedMimeTypes,
  onClose,
}: UploadFileDialogProps) {
  return (
    <ModalDialog
      onClose={onClose}
      effect="blur"
      contentClassName={styles.content}
    >
      <FileDropArea
        supportedMimeTypes={supportedMimeTypes}
        className={styles['drop-area']}
        onFiles={(files) => {
          onClose([...files]);
        }}
      />
    </ModalDialog>
  );
}
