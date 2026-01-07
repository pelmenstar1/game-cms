import { ModalDialog, type ModalProps } from '@game-cms/ui';
import type { FC } from 'react';

import { SpineController } from '../SpineController';
import type { SpineData } from '../SpineRenderer/types';
import styles from './SpineModal.module.scss';

export interface SpineModalProps extends ModalProps {
  spine: SpineData;
}

export const SpineModal: FC<SpineModalProps> = ({ spine, onClose }) => {
  return (
    <ModalDialog
      variant="wide"
      onClose={onClose}
      contentClassName={styles.content}
    >
      <SpineController className={styles.controller} spine={spine} />
    </ModalDialog>
  );
};
