type GetService<T extends { default: unknown }> = T['default'];

declare module '@game-cms/types' {
  interface GameCmsServiceMap {
    'base:entity': GetService<typeof import('./entity.js')>;
    'base::component': GetService<typeof import('./component.js')>;
    'base::database': GetService<typeof import('./database.js')>;
  }
}
