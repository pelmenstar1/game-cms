import { ComponentDefaultRenderer } from '@game-cms/core';
import { Checkbox, List } from '@game-cms/ui';

import styles from './renderer.module.scss';
import { CheckboxChoice, Id } from './types.js';

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  options,
  onDataChanged,
}) => {
  return (
    <List className={styles.root}>
      {Object.entries<CheckboxChoice>(options.choices).map(
        ([key, { title }]) => {
          const onCheckedChange = (state: boolean) => {
            const items = new Set(data);

            if (state) {
              items.add(key);
            } else {
              items.delete(key);
            }

            onDataChanged?.([...items]);
          };

          return (
            <li key={key}>
              <Checkbox
                checked={data.includes(key)}
                onCheckedChanged={onCheckedChange}
              >
                {title}
              </Checkbox>
            </li>
          );
        }
      )}
    </List>
  );
};
