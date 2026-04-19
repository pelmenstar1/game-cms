import { ModalDialog, type ModalProps } from '@game-cms/ui';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { SpineController } from '../SpineController';
import type { SpineData } from '../SpineRenderer/types';
import styles from './SpineModal.module.scss';

export interface SpineModalProps extends ModalProps {
  spine: SpineData;
}

export const SpineModal: FC<SpineModalProps> = ({ spine, onClose }) => {
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpineModal',
  });

  return (
    <ModalDialog
      variant="wide"
      onClose={onClose}
      contentClassName={styles.content}
      title={t('title')}
    >
      <SpineController className={styles.controller} spine={spine} />
    </ModalDialog>
  );
};
