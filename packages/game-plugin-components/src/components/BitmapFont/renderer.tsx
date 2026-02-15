import { useComponentApi } from '@game-cms/component-api';
import { ComponentRenderer } from '@game-cms/core';
import {
  IconButton,
  namedLazy,
  PreviewIcon,
  Toolbar,
  useModal,
} from '@game-cms/ui';

import { getComposeOptions } from './internal/options';

const BitmapFontPreviewModal = namedLazy(
  () => import('../../micro/BitmapFontPreviewModal'),
  'BitmapFontPreviewModal'
);

export const renderer: ComponentRenderer<'game::bitmap-font'> = ({
  data,
  error,
  onDataChanged,
  readonly,
}) => {
  const api = useComponentApi();
  const Compose = api.getComponent('base::compose');
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
        <IconButton disabled={readonly} title="Preview" onClick={onPreview}>
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
