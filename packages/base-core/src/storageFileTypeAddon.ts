export type StorageFileTypeAddon = {
  test: string | ((extension: string) => boolean);
  resultMime: string;
};

declare module '@game-cms/core' {
  interface PluginConfig {
    storageFileTypes?: StorageFileTypeAddon[];
  }
}
