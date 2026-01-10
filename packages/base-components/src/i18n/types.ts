import en from './en.json' with { type: 'json' };

declare module '@game-cms/base-core' {
  interface ComponentI18NTypes {
    base: typeof en;
  }
}
