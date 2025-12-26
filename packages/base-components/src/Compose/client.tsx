/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useComponentApi } from '@game-cms/component-api';
import { ComponentData, ComponentRenderer } from '@game-cms/types';
import { Labeled } from '@game-cms/ui';

import styles from './client.module.scss';

export const renderer: ComponentRenderer<'base::compose'> = ({
  data,
  options,
  error,
  onDataChanged,
}) => {
  const api = useComponentApi();

  return (
    <div className={styles.root}>
      {Object.entries(data).map(([key, itemData]) => {
        const itemError = error?.[key];
        const itemOptions = options[key];
        const Component = api.getComponent(itemOptions.componentId);

        const onItemDataChanged = (newData: ComponentData) => {
          onDataChanged?.({ ...data, [key]: newData });
        };

        return (
          <Labeled key={key} title={key}>
            <Component
              options={itemOptions.options}
              data={itemData}
              error={itemError}
              onDataChanged={onItemDataChanged}
            />
          </Labeled>
        );
      })}
    </div>
  );
};
