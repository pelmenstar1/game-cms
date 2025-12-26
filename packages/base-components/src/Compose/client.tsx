/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ComponentData, ComponentRenderer } from '@game-cms/types';
import { Labeled } from '@game-cms/ui';

import styles from './client.module.scss';

export * from './validator.js';

export const renderer: ComponentRenderer<'base::compose'> = ({
  api,
  data,
  options,
  error,
  onDataChanged,
}) => {
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
