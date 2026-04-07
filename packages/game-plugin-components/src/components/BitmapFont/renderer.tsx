import { useComponentApi } from '@game-cms/component-api';
import { ComponentDefaultRenderer } from '@game-cms/core';
import {
  IconButton,
  namedLazy,
  PreviewIcon,
  Toolbar,
  useModal,
} from '@game-cms/ui';

import { composeId } from '../../types/compose';
import { getComposeOptions } from './internal/options';
import { Id } from './types';

const BitmapFontPreviewModal = namedLazy(
  () => import('../../micro/BitmapFontPreviewModal'),
  'BitmapFontPreviewModal'
);

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  error,
  onDataChanged,
  readOnly,
}) => {
  const api = useComponentApi();
  const Compose = api.getDefaultRenderer(composeId);
  const showModal = useModal();

  const onPreview = () => {
    void showModal(BitmapFontPreviewModal, {
      texturesUrls: data.pages.map((texture) => texture.url),
      atlasUrl: data.atlas[0].url,
    });
  };

  return (
    <div>
      <Toolbar>
        <IconButton disabled={readOnly} title="Preview" onClick={onPreview}>
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
