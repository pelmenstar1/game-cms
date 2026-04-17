import { EntityId } from '@game-cms/base-core';
import { Button, ModalDialog, ModalProps } from '@game-cms/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectableEntityListLoader } from '../SelectableEntityListLoader/index.js';
import styles from './EntitySelectModal.module.scss';

export interface EntitySelectModalProps extends ModalProps<string | undefined> {
  entityId: EntityId;
}

export function EntitySelectModal({
  entityId,
  onClose,
}: EntitySelectModalProps) {
  const { t } = useTranslation('base');

  const [selectedItemId, setSelectedItemId] = useState<string>();

  return (
    <ModalDialog
      title={t('micro.EntitySelectModal.title')}
      contentClassName={styles['content']}
      onClose={onClose}
      footer={
        <>
          <Button
            onClick={() => {
              onClose(undefined);
            }}
          >
            {t('common.cancel')}
          </Button>

          <Button
            buttonVariant="solid"
            disabled={selectedItemId === undefined}
            onClick={() => {
              onClose(selectedItemId);
            }}
          >
            {t('common.select')}
          </Button>
        </>
      }
    >
      <SelectableEntityListLoader
        className={styles['list']}
        entityId={entityId}
        selectedItemId={selectedItemId}
        onItemSelected={setSelectedItemId}
      />
    </ModalDialog>
  );
}
