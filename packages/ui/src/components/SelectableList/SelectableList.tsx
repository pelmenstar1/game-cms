import { ChangeEvent, Key, ReactNode, useCallback, useId } from 'react';

import { classNames } from '../../utils/classNames';
import styles from './SelectableList.module.scss';

export interface SelectableListProps<T extends { id: Key }> {
  disabled?: boolean;
  className?: string;
  items: T[];

  selectedItem?: NoInfer<T>;
  onSelect?: (value: T) => void;

  children: (value: T) => ReactNode;
}

export function SelectableList<T extends { id: Key }>({
  disabled,
  className,
  items,
  selectedItem,
  onSelect,
  children,
}: SelectableListProps<T>) {
  const name = useId();

  const onChecked = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { target } = event;
      const selectedId = target.dataset.id;
      const item = items.find(({ id }) => id === selectedId);
      if (item !== undefined) {
        onSelect?.(item);
      }
    },
    [items, onSelect]
  );

  return (
    <div className={classNames(styles.root, className)}>
      {items.map((item) => {
        const isChecked = selectedItem?.id === item.id;

        return (
          <label
            key={item.id}
            tabIndex={0}
            className={classNames(
              styles.item,
              isChecked && styles['item-selected']
            )}
          >
            <input
              type="radio"
              name={name}
              disabled={disabled}
              checked={isChecked}
              data-id={item.id}
              onChange={onChecked}
            />
            {children(item)}
          </label>
        );
      })}
    </div>
  );
}
