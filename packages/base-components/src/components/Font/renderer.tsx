import { useComponentApi } from '@game-cms/component-api';
import { ComponentRenderer } from '@game-cms/core';
import {
  IconButton,
  namedLazy,
  PreviewIcon,
  Toolbar,
  useModal,
} from '@game-cms/ui';
import { useCallback, useMemo } from 'react';

import { getRepeatableOptions, RepeatableArgs } from './internal/repeatable.js';
import styles from './renderer.module.scss';

const FontPreviewModal = namedLazy(
  () => import('../../micro/FontPreviewModal/index.js'),
  'FontPreviewModal'
);

export const renderer: ComponentRenderer<'base::font'> = ({
  data,
  options,
  error,
  onDataChanged,
  readonly,
}) => {
  const api = useComponentApi();
  const showModal = useModal();

  const Repeatable = api.getComponent('base::repeatable');

  const repeatableOptions = useMemo(
    () => getRepeatableOptions(options),
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
        readonly={readonly}
      />
    </div>
  );
};
