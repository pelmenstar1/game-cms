import { ModalDialog, ModalProps } from '@game-cms/ui';

import { ThreeDModelController } from '../ThreeDModelController';
import styles from './ThreeDModelPreviewModal.module.scss';

export interface ThreeDModelPreviewModalProps extends ModalProps {
  source: string;
}

export function ThreeDModelPreviewModal({
  source,
  onClose,
}: ThreeDModelPreviewModalProps) {
  return (
    <ModalDialog
      onClose={onClose}
      title="3D preview"
      contentClassName={styles.content}
    >
      <ThreeDModelController className={styles.controller} source={source} />
    </ModalDialog>
  );
}
