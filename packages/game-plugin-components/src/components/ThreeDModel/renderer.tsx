import { useComponentApi } from '@game-cms/component-api';
import { ComponentDefaultRenderer } from '@game-cms/core';
import {
  IconButton,
  namedLazy,
  PreviewIcon,
  Toolbar,
  useModal,
} from '@game-cms/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { composeId } from '../../types/compose.js';
import { getComposeOptions } from './internal/options.js';
import { Id } from './types.js';

const ThreeDModelPreviewModal = namedLazy(
  () => import('../../micro/ThreeDModelPreviewModal/index.js'),
  'ThreeDModelPreviewModal'
);

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  error,
  onDataChanged,
  readOnly,
}) => {
  const { file: files } = data;

  const { t } = useTranslation('game');

  const api = useComponentApi();
  const Compose = api.getDefaultRenderer(composeId);

  const showModal = useModal();

  const onPreview = useCallback(() => {
    const [singleFile] = files;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (singleFile !== undefined) {
      void showModal(ThreeDModelPreviewModal, { source: singleFile.url });
    }
  }, [files, showModal]);

  return (
    <div>
      <Toolbar>
        <IconButton
          title={t('common.preview')}
          hover="fill"
          onClick={onPreview}
          disabled={error !== undefined}
        >
          <PreviewIcon />
        </IconButton>
      </Toolbar>

      <Compose
        data={data}
        options={getComposeOptions()}
        error={error}
        onDataChanged={onDataChanged}
        readOnly={readOnly}
      />
    </div>
  );
};
