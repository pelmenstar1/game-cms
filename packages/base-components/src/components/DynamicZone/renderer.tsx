import { useComponentApi } from '@game-cms/component-api';
import {
  ComponentClientDataById,
  ComponentOptionsById,
  ComponentProps,
} from '@game-cms/core';
import { Button } from '@game-cms/ui';
import { useCallback, useMemo } from 'react';

import { ComponentList } from '../../micro/ComponentList/index.js';
import styles from './renderer.module.scss';

type Id = 'base::dynamic-zone';

export const renderer = <Args,>({
  data,
  options,
  error,
  onDataChanged,
}: ComponentProps<Id, Args>) => {
  type Data = ComponentClientDataById<Id, Args>;
  type Options = ComponentOptionsById<Id, Args>;

  const api = useComponentApi();

  const items = useMemo(() => {
    return data.map((itemData, index) => {
      const itemOptions = options[itemData.key];

      return {
        key: itemData.clientKey,
        componentId: itemOptions.componentId,
        options: itemOptions.options,
        title: itemOptions.title,
        data: itemData.data,
        error: error?.[index],
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

  return (
    <div className={styles.root}>
      <ComponentList items={items} onItemsChanged={onItemsChanged} />

      <div className={styles['component-palette']}>
        {Object.entries<Options[keyof Options]>(options).map(
          ([key, itemOptions]) => {
            const onClick = () => {
              const { componentId, options } = itemOptions;

              onDataChanged?.([
                ...data,
                {
                  key,
                  clientKey: api.generateId(),
                  data: api.getDefaultData(componentId, options),
                },
              ] as Data);
            };

            return (
              <Button
                key={key}
                className={styles['component-palette-item']}
                onClick={onClick}
              >
                {itemOptions.option.title}
              </Button>
            );
          }
        )}
      </div>
    </div>
  );
};
