import { ComponentRenderer } from '@game-cms/core';
import {
  Button,
  DeleteIcon,
  IconButton,
  namedLazy,
  PlusIcon,
  Prefixed,
  PreviewIcon,
  useModal,
} from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import styles from './renderer.module.scss';

const EntitySelectModal = namedLazy(
  () => import('../../micro/EntitySelectModal/index.js'),
  'EntitySelectModal'
);

const EntityPreviewModal = namedLazy(
  () => import('../../micro/EntityPreviewModal/index.js'),
  'EntityPreviewModal'
);

export const renderer: ComponentRenderer<'base::entity-reference'> = ({
  data,
  options: { entityId },
  onDataChanged,
  readonly,
}) => {
  const { t } = useTranslation('base');
  const showModal = useModal();

  const onAddEntity = async () => {
    const selectedId = await showModal(EntitySelectModal, { entityId });

    if (selectedId !== undefined) {
      onDataChanged?.(selectedId);
    }
  };

  const onDeleteEntity = () => {
    onDataChanged?.(null);
  };

  const onShowEntityPreview = () => {
    if (data !== null) {
      void showModal(EntityPreviewModal, { entityId, documentId: data });
    }
  };

  return (
    <div className={styles['root']}>
      {data === null ? (
        <Button
          className={styles['add-button']}
          onClick={onAddEntity}
          disabled={readonly}
        >
          <PlusIcon />
        </Button>
      ) : (
        <div className={styles['entity-preview']}>
          <Prefixed value="ID" className={styles['entity-preview-id']}>
            {data}
          </Prefixed>

          <IconButton title={t('common.preview')} onClick={onShowEntityPreview}>
            <PreviewIcon />
          </IconButton>

          <IconButton
            title={t('common.delete')}
            onClick={onDeleteEntity}
            disabled={readonly}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};
