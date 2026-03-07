// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PluginClientDashboardConfig {}

declare module '../plugin.js' {
  interface OwnPluginClientConfig {
    dashboard?: PluginClientDashboardConfig;
  }
}
