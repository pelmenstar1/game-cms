import { useComponentApi } from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentRenderer,
} from '@game-cms/core';
import { IconButton, Labeled, PreviewIcon, useModal } from '@game-cms/ui';
import { useCallback } from 'react';

import { SpineModal } from '../../micro/SpineModal';
import { ATLAS_OPTIONS, IMAGES_OPTIONS, SKELETON_OPTIONS } from './constants';
import styles from './renderer.module.scss';

type FileData = ComponentClientDataById<'base::file'>[number];

export const renderer: ComponentRenderer<'game::spine'> = ({
  data,
  error,
  onDataChanged,
}) => {
  const showModal = useModal();
  const api = useComponentApi();

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
      <div className={styles.header}>
        <IconButton
          title="View"
          disabled={!previewEnabled}
          onClick={onShowPreview}
        >
          <PreviewIcon />
        </IconButton>
      </div>

      <div className={styles.data}>
        <Labeled title="Skeleton">
          <FileComponent
            data={data.skeleton}
            options={SKELETON_OPTIONS}
            error={error?.skeleton}
            onDataChanged={onSkeletonChanged}
          />
        </Labeled>

        <Labeled title="Atlas">
          <FileComponent
            data={data.atlas}
            options={ATLAS_OPTIONS}
            error={error?.atlas}
            onDataChanged={onAtlasChanged}
          />
        </Labeled>

        <Labeled title="Images">
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
