import { useComponentApi } from '@game-cms/component-api';
import {
  ComponentClientDataById,
  ComponentOptionsById,
  ComponentProps,
} from '@game-cms/core';
import { classNames, Typography } from '@game-cms/ui';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ComponentList } from '../../micro/ComponentList/index.js';
import { DynamicZonePalette } from '../../micro/DynamicZonePalette/index.js';
import styles from './renderer.module.scss';

type Id = 'base::dynamic-zone';

export const renderer = <Args,>({
  data,
  options: { maxItems, options },
  error,
  readonly,
  onDataChanged,
}: ComponentProps<Id, Args>) => {
  type Data = ComponentClientDataById<Id, Args>;
  type Options = ComponentOptionsById<Id, Args>['options'];

  const api = useComponentApi();

  const { t } = useTranslation('base', {
    keyPrefix: 'components.DynamicZone',
  });

  const canAddItems =
    !readonly && (maxItems === undefined || data.length < maxItems);

  const errorText = error?.ownError ? t(`errors.${error.ownError}`) : '';

  const items = useMemo(() => {
    return data.map((itemData, index) => {
      const itemOptions = options[itemData.key];

      return {
        key: itemData.clientKey,
        componentId: itemOptions.componentId,
        options: itemOptions.options,
        title: itemOptions.title,
        data: itemData.data,
        error: error?.items?.[index],
        itemKey: itemData.key,
      };
    });
  }, [data, error, options]);

  const onItemsChanged = useCallback(
    (newItems: typeof items) => {
      onDataChanged?.(
        newItems.map((item) => ({
          key: item.itemKey,
          clientKey: item.key,
          data: item.data,
        })) as Data
      );
    },
    [onDataChanged]
  );

  const paletteItems = useMemo(
    () =>
      Object.entries<Options[keyof Options]>(options).map(([key, item]) => ({
        key: key as keyof Options,
        title: item.option.title,
      })),
    [options]
  );

  const onPaletteClick = (key: keyof Options) => {
    const { componentId, options: baseOptions } = options[key];

    onDataChanged?.([
      ...data,
      {
        key,
        clientKey: api.generateId(),
        data: api.getDefaultData(componentId, baseOptions),
      },
    ] as Data);
  };

  return (
    <div>
      <div
        className={classNames(
          styles.content,
          items.length === 0 && styles['content-empty']
        )}
      >
        <ComponentList
          items={items}
          readonly={readonly}
          onItemsChanged={onItemsChanged}
        />

        {canAddItems && (
          <DynamicZonePalette
            error={errorText.length > 0}
            items={paletteItems}
            onItemClick={onPaletteClick}
          />
        )}
      </div>

      {errorText.length > 0 && (
        <Typography className={styles.error}>{errorText}</Typography>
      )}
    </div>
  );
};
