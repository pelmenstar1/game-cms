import { useComponentApi } from '@game-cms/component-api';
import { ComponentRenderer } from '@game-cms/core';
import { IconButton, PlusIcon } from '@game-cms/ui';
import { useCallback, useMemo } from 'react';

import { ComponentList } from '../../micro/ComponentList/ComponentList.js';
import styles from './renderer.module.scss';

export const renderer: ComponentRenderer<'base::repeatable'> = ({
  options,
  data,
  error,
  onDataChanged,
}) => {
  const api = useComponentApi();

  const items = useMemo(() => {
    const { baseOptions, componentId, title } = options;

    return data.map((dataItem, index) => ({
      key: dataItem.clientKey,
      componentId,
      title,
      options: baseOptions,
      data: dataItem.data,
      error: error?.items?.[index],
    }));
  }, [data, error, options]);

  const onAdd = () => {
    const defaultData = api.getDefaultData(
      options.componentId,
      options.baseOptions
    );

    onDataChanged?.([
      ...data,
      { clientKey: api.generateId(), data: defaultData },
    ]);
  };

  const onItemsChanged = useCallback(
    (newItems: typeof items) => {
      onDataChanged?.(
        newItems.map((item) => ({ clientKey: item.key, data: item.data }))
      );
    },
    [onDataChanged]
  );

  return (
    <div className={styles.root}>
      <ComponentList
        className={styles.list}
        items={items}
        onItemsChanged={onItemsChanged}
      />

      <IconButton className={styles.add} title="Add element" onClick={onAdd}>
        <PlusIcon />
      </IconButton>
    </div>
  );
};
