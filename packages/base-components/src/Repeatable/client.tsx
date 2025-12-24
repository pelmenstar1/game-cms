import { ComponentRenderer } from '@game-cms/types';
import { IconButton, PlusIcon } from '@game-cms/ui';

import styles from './client.module.scss';

export * from './validator.js';

export const renderer: ComponentRenderer<'base::list'> = ({
  api,
  options,
  data,
  error,
  onDataChanged,
}) => {
  const Component = api.getComponent(options.controller);

  const onAdd = () => {
    onDataChanged?.([...data, api.getDefaultData(options.controller)]);
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
