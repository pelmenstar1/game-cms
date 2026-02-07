import { useComponentApi } from '@game-cms/component-api';
import type { ComponentClientDataById, ComponentProps } from '@game-cms/core';
import {
  IconButton,
  namedLazy,
  PreviewIcon,
  Toolbar,
  useModal,
} from '@game-cms/ui';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// import { SpritesheetPreviewModal } from '../../micro/SpritesheetPreviewModal';
import styles from './renderer.module.scss';
import type { ResolveSpritesheetArgs } from './types';

const SpritesheetPreviewModal = namedLazy(
  () => import('../../micro/SpritesheetPreviewModal'),
  'SpritesheetPreviewModal'
);

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
  const showModal = useModal();

  const { base: baseData, spritesheets } = data;

  const BaseComponent = api.getComponent(options.componentId);

  const onPreview = useCallback(() => {
    if (spritesheets) {
      void showModal(SpritesheetPreviewModal, {
        entryMap: spritesheets,
      });
    }
  }, [spritesheets, showModal]);

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
