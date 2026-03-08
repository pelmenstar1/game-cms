import { useState } from 'react';

import { Tabs, type TabsChildren, type TabsProps } from '../Tabs';

export type UncontrolledTabsProps<K extends string> = Omit<
  TabsProps<K>,
  'selectedTab' | 'onSelectedTabChanged'
>;

function getInitialTab<K extends string>(children: TabsChildren<K>) {
  const firstTab = Array.isArray(children) ? children[0] : children;

  if (typeof firstTab === 'object' && firstTab !== null) {
    return firstTab.props.tabId;
  }

  return '' as K;
}

export function UncontrolledTabs<K extends string>({
  children,
  ...rest
}: UncontrolledTabsProps<K>) {
  const [selectedTab, setSelectedTab] = useState(() => getInitialTab(children));

  return (
    <Tabs
      selectedTab={selectedTab}
      onSelectedTabChanged={setSelectedTab}
      {...rest}
    >
      {children}
    </Tabs>
  );
}
