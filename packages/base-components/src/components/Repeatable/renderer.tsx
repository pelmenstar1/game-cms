import { useComponentApi } from '@game-cms/component-api';
import { ComponentDefaultRenderer } from '@game-cms/core';
import { IconButton, PlusIcon } from '@game-cms/ui';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ComponentList } from '../../micro/ComponentList/ComponentList.js';
import { Id } from './internal/types.js';
import styles from './renderer.module.scss';

export const renderer: ComponentDefaultRenderer<Id> = ({
  options,
  data,
  error,
  readOnly,
  onDataChanged,
}) => {
  const { t } = useTranslation('base', {
    keyPrefix: 'components.Repeatable',
  });

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
        readOnly={readOnly}
        onItemsChanged={onItemsChanged}
      />

      {!readOnly && (
        <IconButton
          className={styles.add}
          title={t('addElement')}
          onClick={onAdd}
        >
          <PlusIcon />
        </IconButton>
      )}
    </div>
  );
};
