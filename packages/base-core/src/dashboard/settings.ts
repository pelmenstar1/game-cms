import { ApiRouteId } from '@game-cms/core/api';

export type SettingsTab = {
  text: string;
  href: string;
  permission?: ApiRouteId;
};

declare module './client.js' {
  interface PluginClientDashboardConfig {
    settings?: {
      tabs?: SettingsTab[];
    };
  }
}
