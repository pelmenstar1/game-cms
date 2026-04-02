export interface ServerConfig {
  port: number;
}

declare module './config.js' {
  interface UnresolvedCmsConfig {
    server: ServerConfig;
  }
}
