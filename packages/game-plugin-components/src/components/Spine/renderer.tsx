import { useComponentApi } from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentRenderer,
} from '@game-cms/core';
import {
  IconButton,
  Labeled,
  PreviewIcon,
  Toolbar,
  useModal,
} from '@game-cms/ui';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ATLAS_OPTIONS,
  IMAGES_OPTIONS,
  SKELETON_OPTIONS,
} from './internal/constants';
import styles from './renderer.module.scss';

type FileData = ComponentClientDataById<'base::file'>[number];

const SpineModal = React.lazy(async () => {
  const { SpineModal } = await import('../../micro/SpineModal');

  return { default: SpineModal };
});

export const renderer: ComponentRenderer<'game::spine'> = ({
  data,
  error,
  onDataChanged,
}) => {
  const showModal = useModal();
  const api = useComponentApi();
  const { t } = useTranslation('game');

  const FileComponent = api.getComponent('base::file');

  const previewEnabled =
    data.atlas.length > 0 && data.skeleton.length > 0 && data.images.length > 0;

  const onSkeletonChanged = useCallback(
    (skeleton: FileData[]) => {
      onDataChanged?.({ ...data, skeleton });
    },
    [data, onDataChanged]
  );

  const onAtlasChanged = useCallback(
    (atlas: FileData[]) => {
      onDataChanged?.({ ...data, atlas });
    },
    [data, onDataChanged]
  );

  const onImagesChanged = useCallback(
    (images: FileData[]) => {
      onDataChanged?.({ ...data, images });
    },
    [data, onDataChanged]
  );

  const onShowPreview = useCallback(() => {
    void showModal(SpineModal, {
      spine: {
        atlas: (data.atlas[0] as unknown as { url: string }).url,
        skeleton: (data.skeleton[0] as unknown as { url: string }).url,
        images: data.images.map(
          (file) => (file as unknown as { url: string }).url
        ),
      },
    });
  }, [data, showModal]);

  return (
    <div className={styles.root}>
      <Toolbar className={styles.header}>
        <IconButton
          title={t('common.preview')}
          disabled={!previewEnabled}
          onClick={onShowPreview}
        >
          <PreviewIcon />
        </IconButton>
      </Toolbar>

      <div className={styles.data}>
        <Labeled title={t('components.Spine.skeleton')}>
          <FileComponent
            data={data.skeleton}
            options={SKELETON_OPTIONS}
            error={error?.skeleton}
            onDataChanged={onSkeletonChanged}
          />
        </Labeled>

        <Labeled title={t('components.Spine.atlas')}>
          <FileComponent
            data={data.atlas}
            options={ATLAS_OPTIONS}
            error={error?.atlas}
            onDataChanged={onAtlasChanged}
          />
        </Labeled>

        <Labeled title={t('components.Spine.images')}>
          <FileComponent
            data={data.images}
            options={IMAGES_OPTIONS}
            error={error?.images}
            onDataChanged={onImagesChanged}
          />
        </Labeled>
      </div>
    </div>
  );
};
