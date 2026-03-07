import { FC } from 'react';

export type DashboardTabInfo = {
  text: string;
  href: string;
  icon: FC;
};

declare module './client.js' {
  interface PluginClientDashboardConfig {
    tabs?: DashboardTabInfo[];
  }
}
