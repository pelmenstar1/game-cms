import { useComponentApi } from '@game-cms/component-api';
import type { ComponentClientDataById, ComponentProps } from '@game-cms/core';
import { IconButton, PreviewIcon, Toolbar } from '@game-cms/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useSpritesheetPreviewModal } from '../../hooks/useSpritesheetPreviewModal';
import styles from './renderer.module.scss';
import type { ResolveSpritesheetArgs } from './types';

export const renderer = <Args,>({
  data,
  options,
  error,
  onDataChanged,
}: ComponentProps<'game::spritesheet-wrapper', Args>) => {
  type Id = ResolveSpritesheetArgs<Args>['id'];
  type BaseArgs = ResolveSpritesheetArgs<Args>['baseArgs'];

  const api = useComponentApi();
  const { t } = useTranslation('game');
  const showSpritesheetPreview = useSpritesheetPreviewModal();

  const { base: baseData, spritesheets } = data;

  const BaseComponent = api.getComponent(options.componentId);

  const onPreview = useCallback(() => {
    if (spritesheets) {
      void showSpritesheetPreview({
        entryMap: spritesheets,
      });
    }
  }, [showSpritesheetPreview, spritesheets]);

  const handleDataChanged = useCallback(
    (data: ComponentClientDataById<Id, BaseArgs>) => {
      onDataChanged?.({ base: data, spritesheets });
    },
    [onDataChanged, spritesheets]
  );

  return (
    <div>
      <Toolbar className={styles['header']}>
        {data.spritesheets && (
          <IconButton title={t('common.preview')} onClick={onPreview}>
            <PreviewIcon />
          </IconButton>
        )}
      </Toolbar>

      <BaseComponent
        data={baseData}
        options={options.baseOptions}
        error={error}
        onDataChanged={handleDataChanged}
      />
    </div>
  );
};
