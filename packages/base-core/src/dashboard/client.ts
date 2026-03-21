export interface PluginClientDashboardConfig {}

declare module '../plugin.js' {
  interface OwnPluginClientConfig {
    dashboard?: PluginClientDashboardConfig;
  }
}
