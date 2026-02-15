import { ModalDialog, ModalProps } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { ThreeDModelController } from '../ThreeDModelController';
import styles from './ThreeDModelPreviewModal.module.scss';

export interface ThreeDModelPreviewModalProps extends ModalProps {
  source: string;
}

export function ThreeDModelPreviewModal({
  source,
  onClose,
}: ThreeDModelPreviewModalProps) {
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.ThreeDModelPreviewModal',
  });

  return (
    <ModalDialog
      onClose={onClose}
      title={t('title')}
      contentClassName={styles.content}
    >
      <ThreeDModelController className={styles.controller} source={source} />
    </ModalDialog>
  );
}
