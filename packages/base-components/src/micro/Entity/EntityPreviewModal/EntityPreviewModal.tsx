import { EntityId } from '@game-cms/base-core';
import { ModalDialog, ModalProps } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { EntityPreviewLoader } from '../EntityPreviewLoader/index.js';

export interface EntityPreviewModalProps extends ModalProps {
  entityId: EntityId;
  documentId: string;
}

export function EntityPreviewModal({
  entityId,
  documentId,
  onClose,
}: EntityPreviewModalProps) {
  const { t } = useTranslation('base', {
    keyPrefix: 'micro.EntityPreviewModal',
  });

  return (
    <ModalDialog title={t('title')} onClose={onClose}>
      <EntityPreviewLoader entityId={entityId} documentId={documentId} />
    </ModalDialog>
  );
}
