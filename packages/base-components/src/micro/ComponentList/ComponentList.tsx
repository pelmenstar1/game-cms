import { useComponentApi } from '@game-cms/component-api';
import {
  ComponentClientDataById,
  ComponentClientOptionsById,
  ComponentData,
  ComponentErrorById,
  ComponentId,
} from '@game-cms/core';
import {
  Accordion,
  classNames,
  DeleteIcon,
  DraggableList,
  DragHandle,
  IconButton,
} from '@game-cms/ui';
import { Key } from 'react';

import {
  resolveTitleSpec,
  TitleSpec,
  TitleSpecById,
} from '../../internal/title.js';
import styles from './ComponentList.module.scss';

export type ComponentListItem<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  key: Key;
  componentId: Id;
  title?: TitleSpecById<Id, Args>;
  data: ComponentClientDataById<Id, Args>;
  options: ComponentClientOptionsById<Id, Args>;
  error?: ComponentErrorById<Id, Args>;
};

export type ComponentListProps<
  Id extends ComponentId,
  Args,
  T extends ComponentListItem<Id, Args>,
> = {
  className?: string;
  items: T[];
  readonly?: boolean;
  onItemsChanged: (items: T[]) => void;
};

export function ComponentList<
  Id extends ComponentId,
  Args,
  T extends ComponentListItem<Id, Args>,
>({
  className,
  items,
  readonly,
  onItemsChanged,
}: ComponentListProps<Id, Args, T>) {
  const api = useComponentApi();

  return (
    <DraggableList
      className={classNames(styles.root, className)}
      items={items}
      onItemsChanged={onItemsChanged}
    >
      {(item, index, handleRef) => {
        const BaseComponent = api.getDefaultRenderer(item.componentId);

        const title = item.title
          ? resolveTitleSpec<object>(
              item.title as TitleSpec<never>,
              item.data as never
            ).toString()
          : '';

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

        const header = (
          <>
            <IconButton
              title="Delete item"
              className={styles['delete-button']}
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>

            <DragHandle ref={handleRef} />
          </>
        );

        return (
          <Accordion
            key={item.key}
            title={title}
            className={styles['item-container']}
            headerContent={readonly ? undefined : header}
            initiallyOpened={index === items.length - 1}
          >
            <BaseComponent
              data={item.data}
              options={item.options}
              error={item.error}
              readonly={readonly}
              onDataChanged={onItemDataChanged}
            />
          </Accordion>
        );
      }}
    </DraggableList>
  );
}
