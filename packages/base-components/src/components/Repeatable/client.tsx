import { useComponentApi } from '@game-cms/component-api';
import { ComponentRenderer } from '@game-cms/types';
import { IconButton, PlusIcon } from '@game-cms/ui';

import styles from './client.module.scss';

export const renderer: ComponentRenderer<'base::list'> = ({
  options,
  data,
  error,
  onDataChanged,
}) => {
  const api = useComponentApi();
  const Component = api.getComponent(options.controller);

  const onAdd = () => {
    const defaultData = api.getDefaultData(options.controller, options.base);

    onDataChanged?.([...data, defaultData]);
  };

  return (
    <div className={styles.root}>
      <div className={styles.list}>
        {data.map((item, index) => (
          <Component
            key={index}
            data={item}
            options={options}
            error={error?.[index]}
            onDataChanged={(newItem) => {
              const newData = [...data];
              newData[index] = newItem;

              onDataChanged?.(newData);
            }}
          />
        ))}
      </div>

      <IconButton className={styles.add} title="Add element" onClick={onAdd}>
        <PlusIcon />
      </IconButton>
    </div>
  );
};
