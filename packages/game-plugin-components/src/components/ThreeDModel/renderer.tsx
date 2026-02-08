import { useComponentApi } from '@game-cms/component-api';
import { ComponentRenderer } from '@game-cms/core';
import {
  IconButton,
  namedLazy,
  PreviewIcon,
  Toolbar,
  useModal,
} from '@game-cms/ui';
import { useCallback } from 'react';

import { getComposeOptions } from './internal/options.js';

const ThreeModelPreviewModal = namedLazy(
  () => import('../../micro/ThreeDModelPreviewModal/index.js'),
  'ThreeDModelPreviewModal'
);

export const renderer: ComponentRenderer<'game::three-d-model'> = ({
  data,
  error,
  onDataChanged,
  readonly,
}) => {
  const { file } = data;

  const api = useComponentApi();
  const Compose = api.getComponent('base::compose');

  const showModal = useModal();

  const onPreview = useCallback(() => {
    void showModal(ThreeModelPreviewModal, { source: file[0].url });
  }, [file, showModal]);

  return (
    <div>
      <Toolbar>
        <IconButton title="Preview" hover="fill" onClick={onPreview}>
          <PreviewIcon />
        </IconButton>
      </Toolbar>

      <Compose
        data={data}
        options={getComposeOptions()}
        error={error}
        onDataChanged={onDataChanged}
        readonly={readonly}
      />
    </div>
  );
};
