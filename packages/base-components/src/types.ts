import type { FromEntries } from '@game-cms/types';

type ExportedComponents = typeof import('./index');

type Components = {
  [K in keyof ExportedComponents]: ReturnType<
    ExportedComponents[K]
  >['controller'];
};

type ComponentToKeyValue<T extends Record<string, { id: string }>> = {
  [K in keyof T]: [T[K]['id'], T[K]];
}[keyof T];

type ComponentsOutput = FromEntries<ComponentToKeyValue<Components>>;

declare module '@game-cms/types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ComponentMap extends ComponentsOutput {}
}
