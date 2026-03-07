import {
  useClientConfig,
  useSelfSession,
} from '@game-cms/base-components/shared';
import { PluginClientConfig } from '@game-cms/base-core';
import { DataLoader, NavTabInfo, NavTabs, PageUrl } from '@game-cms/ui';
import { useMemo } from 'react';
import { Outlet } from 'react-router';

import styles from './layout.module.scss';

function Tabs({ config }: { config: PluginClientConfig }) {
  const { permissions } = useSelfSession();
  const tabs = config.dashboard?.settings?.tabs;

  const allowedItems = useMemo((): NavTabInfo[] => {
    if (tabs) {
      return tabs
        .filter(
          (tab) =>
            tab.permission === undefined || permissions.has(tab.permission)
        )
        .map((tab) => ({
          text: tab.text,
          href: tab.href as PageUrl,
        }));
    }

    return [];
  }, [permissions, tabs]);

  return (
    <>
      <NavTabs className={styles['nav-tabs']} items={allowedItems} />

      <div className={styles.content}>
        <Outlet />
      </div>
    </>
  );
}

export default function Page() {
  const clientConfig = useClientConfig();

  return (
    <DataLoader result={clientConfig} className={styles.root}>
      {(config) => <Tabs config={config} />}
    </DataLoader>
  );
}
