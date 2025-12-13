import { FileDropArea, ModalDialog, type ModalProps } from '@game-cms/ui';

import styles from './UploadFileDialog.module.scss';

export interface UploadFileDialogProps extends ModalProps<File[] | undefined> {
  className?: string;
}

export function UploadFileDialog({ onClose }: UploadFileDialogProps) {
  return (
    <ModalDialog
      onClose={onClose}
      effect="blur"
      contentClassName={styles.content}
    >
      <FileDropArea
        className={styles['drop-area']}
        onFiles={(files) => {
          onClose([...files]);
        }}
      />
    </ModalDialog>
  );
}
