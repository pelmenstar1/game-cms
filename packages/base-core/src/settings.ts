import { ApiRouteId } from '@game-cms/core/api';

export type SettingsTab = {
  title: string;
  href: string;
  permission?: ApiRouteId;
};

export type SettingsTabMap = Record<string, SettingsTab>;

declare module './plugin.js' {
  interface OwnPluginClientConfig {
    settings?: {
      tabs?: SettingsTabMap;
    };
  }
}
