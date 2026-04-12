import { useComponentApi } from '@game-cms/component-api';
import { ComponentDefaultRenderer } from '@game-cms/core';
import {
  IconButton,
  namedLazy,
  PreviewIcon,
  Toolbar,
  useModal,
} from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { composeId } from '../../types/compose.js';
import { getComposeOptions } from './internal/options.js';
import { Id } from './types.js';

const SpriteStripePreviewModal = namedLazy(
  () => import('../../micro/SpriteStripePreviewModal'),
  'SpriteStripePreviewModal'
);

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  options,
  error,
  onDataChanged,
  readOnly,
}) => {
  const api = useComponentApi();
  const { t } = useTranslation('game');
  const Compose = api.getDefaultRenderer(composeId);

  const showModal = useModal();

  const onPreview = () => {
    void showModal(SpriteStripePreviewModal, {
      imageUrl: data.image[0].url,
      frameWidth: Number.parseInt(data.width),
      frameHeight: Number.parseInt(data.height),
    });
  };

  return (
    <div>
      {!readOnly && (
        <Toolbar>
          <IconButton
            title={t('common.preview')}
            disabled={error !== undefined}
            onClick={onPreview}
          >
            <PreviewIcon />
          </IconButton>
        </Toolbar>
      )}

      <Compose
        data={data}
        options={getComposeOptions(options)}
        error={error}
        onDataChanged={onDataChanged}
        readOnly={readOnly}
      />
    </div>
  );
};
