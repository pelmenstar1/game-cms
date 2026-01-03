import { useComponentApi } from '@game-cms/component-api';
import {
  ComponentClientDataById,
  ComponentData,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/core';
import { classNames, DraggableList } from '@game-cms/ui';
import { Key } from 'react';

import { ItemControlHeader } from '../ItemControlHeader/ItemControlHeader.js';
import styles from './ComponentList.module.scss';

export type ComponentListItem<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  key: Key;
  componentId: Id;
  data: ComponentClientDataById<Id, Args>;
  options: ComponentOptionsById<Id, Args>;
  error?: ComponentErrorById<Id, Args>;
};

export type ComponentListProps<Item extends ComponentListItem> = {
  className?: string;
  items: Item[];
  onItemsChanged: (items: Item[]) => void;
};

export function ComponentList<Item extends ComponentListItem>({
  className,
  items,
  onItemsChanged,
}: ComponentListProps<Item>) {
  const api = useComponentApi();

  return (
    <DraggableList
      className={classNames(styles.root, className)}
      items={items}
      onItemsChanged={onItemsChanged}
    >
      {(item, _, handleRef) => {
        const BaseComponent = api.getComponent(item.componentId);

        const onItemDataChanged = (data: ComponentData) => {
          onItemsChanged(
            items.map((otherItem) =>
              otherItem.key === item.key ? { ...otherItem, data } : otherItem
            )
          );
        };

        const onDelete = () => {
          onItemsChanged(
            items.filter((otherItem) => otherItem.key !== item.key)
          );
        };

        return (
          <div key={item.key} className={styles['item-container']}>
            <ItemControlHeader
              className={styles['item-container-header']}
              deleteTitle="Delete item"
              onDelete={onDelete}
              handleRef={handleRef}
            />

            <BaseComponent
              data={item.data}
              options={item.options}
              error={item.error}
              onDataChanged={onItemDataChanged}
            />
          </div>
        );
      }}
    </DraggableList>
  );
}
