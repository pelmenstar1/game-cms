import { useClientConfig } from '@game-cms/base-components/shared';
import { DashboardTabInfo, PluginClientConfig } from '@game-cms/base-core';
import {
  DataLoader,
  HomeIcon,
  NavTabInfo,
  NavTabs,
  PageUrl,
} from '@game-cms/ui';
import React, { useMemo } from 'react';
import { Outlet } from 'react-router';

import styles from './tabLayout.module.scss';

const defaultTabs: DashboardTabInfo[] = [
  { href: '/', icon: HomeIcon, text: 'Home' },
];

type RendererProps = {
  config: PluginClientConfig;
};

function Renderer({ config }: RendererProps) {
  const items = useMemo((): NavTabInfo[] => {
    const resolvedItems = [...defaultTabs, ...(config.dashboard?.tabs ?? [])];

    return resolvedItems.map(({ href, text, icon: Icon }) => ({
      href: href as PageUrl,
      text,
      icon: <Icon />,
    }));
  }, [config.dashboard?.tabs]);

  return (
    <div className={styles.root}>
      <NavTabs collapsable className={styles['nav-tabs']} items={items} />

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default function Layout() {
  const clientConfigResult = useClientConfig();

  return (
    <DataLoader result={clientConfigResult}>
      {(config) => <Renderer config={config} />}
    </DataLoader>
  );
}
