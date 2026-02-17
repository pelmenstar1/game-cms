import { useComponentApi } from '@game-cms/component-api';
import { ComponentRenderer } from '@game-cms/core';
import { IconButton, PreviewIcon, Toolbar, useModal } from '@game-cms/ui';

import { SpritesheetPreviewModal } from '../../micro/SpritesheetPreviewModal';
import { getComposeOptions } from './internal/options';

export const renderer: ComponentRenderer<'game::spritesheet'> = ({
  data,
  options,
  error,
  onDataChanged,
  readonly,
}) => {
  const api = useComponentApi();
  const Compose = api.getComponent('base::compose');
  const showModal = useModal();

  const onPreview = () => {
    void showModal(SpritesheetPreviewModal, {
      entryMap: {
        base: {
          imageUrl: data.texture[0].url,
          atlasUrl: data.atlas[0].url,
        },
      },
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
        options={getComposeOptions(options)}
        error={error}
        onDataChanged={onDataChanged}
        readonly={readonly}
      />
    </div>
  );
};
