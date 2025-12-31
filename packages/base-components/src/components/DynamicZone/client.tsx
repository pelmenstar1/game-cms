import { useComponentApi } from '@game-cms/component-api';
import { ComponentRenderer } from '@game-cms/types';
import { Button } from '@game-cms/ui';
import { useCallback, useMemo } from 'react';

import {
  ComponentList,
  ComponentListItem,
} from '../../micro/ComponentList/index.js';
import styles from './client.module.scss';

interface ListItem extends ComponentListItem {
  itemKey: string;
}

export const renderer: ComponentRenderer<'base::dynamic-zone'> = ({
  data,
  options,
  error,
  onDataChanged,
}) => {
  const api = useComponentApi();

  const items = useMemo((): ListItem[] => {
    return data.map((itemData, index) => {
      const itemOptions = options[itemData.key];

      return {
        key: itemData.clientKey,
        componentId: itemOptions.componentId,
        options: itemOptions.options,
        data: itemData.data,
        error: error?.[index],
        itemKey: itemData.key,
      };
    });
  }, [data, error, options]);

  const onItemsChanged = useCallback(
    (items: ListItem[]) => {
      onDataChanged?.(
        items.map((item) => ({
          key: item.itemKey,
          clientKey: item.key,
          data: item.data,
        }))
      );
    },
    [onDataChanged]
  );

  return (
    <div className={styles.root}>
      <ComponentList items={items} onItemsChanged={onItemsChanged} />

      <div className={styles['component-palette']}>
        {Object.entries(options).map(([key, itemOptions]) => {
          const onClick = () => {
            const { componentId, options } = itemOptions;

            onDataChanged?.([
              ...data,
              {
                key,
                clientKey: api.idSource(),
                data: api.getDefaultData(componentId, options),
              },
            ]);
          };

          return (
            <Button
              key={key}
              className={styles['component-palette-item']}
              onClick={onClick}
            >
              {itemOptions.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
