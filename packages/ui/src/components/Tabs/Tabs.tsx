import { type MaybeArray } from '@game-cms/shared/collections';
import { type ReactElement, useEffect, useId } from 'react';
import React from 'react';

import { classNames } from '../../utils/classNames';
import { Button } from '../Button';
import { List } from '../List';
import styles from './Tabs.module.scss';

export type TabComponent<K extends string> = ReactElement<{
  id?: string;
  tabId: K;
  isSelected?: boolean;
  title: string;
  labelledBy?: string;
  className?: string;
}>;

export type TabsChildren<K extends string> = MaybeArray<
  TabComponent<K> | undefined | null | false
>;

export type TabsProps<K extends string> = {
  className?: string;
  tabClassName?: string;
  selectedTab: K;
  onSelectedTabChanged: (value: K) => void;
  children: TabsChildren<K>;
};

export function Tabs<K extends string>({
  className,
  tabClassName,
  selectedTab,
  onSelectedTabChanged,
  children,
}: TabsProps<K>) {
  const globalId = useId();
  const childrenArray = (Array.isArray(children) ? children : [children])
    // eslint-disable-next-line unicorn/prefer-native-coercion-functions
    .filter((value): value is TabComponent<K> => Boolean(value));

  const selectedChild =
    childrenArray.find(({ props }) => props.tabId === selectedTab) ??
    childrenArray[0];

  useEffect(() => {
    const effectiveTab = selectedChild.props.tabId;
    if (effectiveTab !== selectedTab) {
      onSelectedTabChanged(effectiveTab);
    }
  }, [selectedChild, onSelectedTabChanged, selectedTab]);

  return (
    <div className={classNames(styles.root, className)}>
      <List className={styles.tablist} role="tablist">
        {childrenArray.map(({ props }) => (
          <Button
            id={`${globalId}-tab-${props.tabId}`}
            key={props.tabId}
            role="tab"
            aria-selected={props.tabId === selectedTab}
            aria-controls={`${globalId}-panel-${props.tabId}`}
            onClick={() => {
              onSelectedTabChanged(props.tabId);
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
        className: classNames(selectedChild.props.className, tabClassName),
      })}
    </div>
  );
}
