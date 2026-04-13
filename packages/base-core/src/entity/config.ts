export interface EntityConfig {}

declare module '@game-cms/core' {
  interface UnresolvedCmsConfig {
    entity?: EntityConfig;
  }
}
