import { ReactElement, useId, useState } from 'react';
import React from 'react';

import { classNames } from '../../utils/classNames';
import { Button } from '../Button';
import { List } from '../List';
import styles from './Tabs.module.scss';

type MaybeArray<T> = T | T[];

export type TabsProps<K extends string> = {
  className?: string;
  children: MaybeArray<
    ReactElement<{
      id?: string;
      tabId: K;
      isSelected?: boolean;
      title: string;
      labelledBy?: string;
    }>
  >;
};

export function Tabs<K extends string>({ className, children }: TabsProps<K>) {
  const globalId = useId();
  const childrenArray = Array.isArray(children) ? children : [children];

  const [selected, setSelected] = useState<K>(() => {
    const tabId = childrenArray[0]?.props.tabId;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (tabId === undefined) {
      throw new Error('No children');
    }

    return tabId;
  });

  const selectedChild = childrenArray.find(
    ({ props }) => props.tabId === selected
  );

  if (selectedChild === undefined) {
    throw new Error('Invalid state: selected child is undefined');
  }

  return (
    <div className={classNames(styles.root, className)}>
      <List className={styles.tablist} role="tablist">
        {childrenArray.map(({ props }) => (
          <Button
            id={`${globalId}-tab-${props.tabId}`}
            key={props.tabId}
            role="tab"
            aria-selected={props.tabId === selected}
            aria-controls={`${globalId}-panel-${props.tabId}`}
            onClick={() => {
              setSelected(props.tabId);
            }}
          >
            {props.title}
          </Button>
        ))}
      </List>

      {React.cloneElement(selectedChild, {
        isSelected: true,
        id: `${globalId}-panel-${selectedChild.props.tabId}`,
        labelledBy: `${globalId}-tab-${selectedChild.props.tabId}`,
      })}
    </div>
  );
}
