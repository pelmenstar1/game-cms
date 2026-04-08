import { useComponentApi } from '@game-cms/component-api';
import { ComponentDefaultRenderer } from '@game-cms/core';
import {
  IconButton,
  namedLazy,
  PreviewIcon,
  Toolbar,
  useModal,
} from '@game-cms/ui';
import { useCallback, useMemo } from 'react';

import {
  getRepeatableClientOptions,
  RepeatableArgs,
} from './internal/repeatable.js';
import styles from './renderer.module.scss';
import { Id } from './types.js';

const FontPreviewModal = namedLazy(
  () => import('../../micro/FontPreviewModal/index.js'),
  'FontPreviewModal'
);

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  options,
  error,
  onDataChanged,
  readOnly,
}) => {
  const api = useComponentApi();
  const showModal = useModal();

  const Repeatable = api.getDefaultRenderer('base::repeatable');

  const repeatableOptions = useMemo(
    () => getRepeatableClientOptions(options),
    [options]
  );

  const onShowPreview = useCallback(() => {
    void showModal(FontPreviewModal, {
      fonts: data.map(({ data }) => ({
        source: data.file[0].url,
        weight: Number.parseInt(data.weight),
        style: data.style,
      })),
    });
  }, [data, showModal]);

  return (
    <div className={styles.root}>
      <Toolbar className={styles['toolbar']}>
        <IconButton
          title="Preview"
          onClick={onShowPreview}
          disabled={error !== undefined}
        >
          <PreviewIcon />
        </IconButton>
      </Toolbar>

      <Repeatable<RepeatableArgs>
        data={data}
        options={repeatableOptions}
        error={error}
        onDataChanged={onDataChanged}
        readOnly={readOnly}
      />
    </div>
  );
};
