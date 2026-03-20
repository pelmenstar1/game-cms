import { useComponentApi } from '@game-cms/component-api';
import type { ComponentClientDataById, ComponentProps } from '@game-cms/core';
import { IconButton, PreviewIcon, Toolbar } from '@game-cms/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useSpritesheetPreviewModal } from '../../hooks/useSpritesheetPreviewModal';
import styles from './renderer.module.scss';
import type { ResolveAssetWrapperArgs } from './types';

export const renderer = <Args,>({
  data,
  options,
  error,
  onDataChanged,
}: ComponentProps<'game::asset-wrapper', Args>) => {
  type Id = ResolveAssetWrapperArgs<Args>['id'];
  type BaseArgs = ResolveAssetWrapperArgs<Args>['baseArgs'];

  const api = useComponentApi();
  const { t } = useTranslation('game');
  const showSpritesheetPreview = useSpritesheetPreviewModal();

  const { base: baseData, derived } = data;
  const spritesheets = derived?.spritesheet;

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
      onDataChanged?.({ base: data, derived });
    },
    [onDataChanged, derived]
  );

  return (
    <div>
      <Toolbar className={styles['header']}>
        {spritesheets && (
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
