import { useComponentApi } from '@game-cms/component-api';
import { ComponentDefaultRenderer } from '@game-cms/core';
import { IconButton, PreviewIcon, Toolbar } from '@game-cms/ui';

import { useSpritesheetPreviewModal } from '../../hooks/useSpritesheetPreviewModal';
import { composeId } from '../../types/compose';
import { getComposeOptions } from './internal/options';
import { Id } from './types';

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  options,
  error,
  onDataChanged,
  readOnly,
}) => {
  const api = useComponentApi();
  const Compose = api.getDefaultRenderer(composeId);

  const showSpritesheetPreview = useSpritesheetPreviewModal();

  const onPreview = () => {
    void showSpritesheetPreview({
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
        <IconButton disabled={readOnly} title="Preview" onClick={onPreview}>
          <PreviewIcon />
        </IconButton>
      </Toolbar>

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
