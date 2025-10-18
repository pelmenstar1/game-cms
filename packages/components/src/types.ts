type GetComponent<T extends { default: unknown }> = T['default'];

declare module '@game-cms/types' {
  interface ComponentMap {
    'base::number': GetComponent<typeof import('./Number')>;
    'base::text': GetComponent<typeof import('./Text')>;
  }
}
