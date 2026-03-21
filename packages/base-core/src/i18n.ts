import 'i18next';

export interface ComponentI18NTypes {}

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    resources: ComponentI18NTypes;
  }
}

declare module '@game-cms/core' {
  interface UnresolvedCmsConfig {
    i18n?: {
      language: string;
    };
  }
}
