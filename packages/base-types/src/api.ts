export type ApiErrorCodePath<T> = T extends string
  ? T
  : T extends string[]
    ? T[number]
    : {
        [K in keyof T & string]: `${K}/${ApiErrorCodePath<T[K]>}`;
      }[keyof T & string];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApiErrorCodeMap {}

export type ApiErrorCode = {
  [NS in keyof ApiErrorCodeMap]: `${NS}::${ApiErrorCodePath<ApiErrorCodeMap[NS]>}`;
}[keyof ApiErrorCodeMap];

export type ApiErrorCodeTypeMap<T> = Partial<Record<ApiErrorCode, T>>;

export type ApiErrorStatusMap = ApiErrorCodeTypeMap<number>;

declare module '@game-cms/types' {
  interface PluginApiConfig {
    error?: {
      statuses?: ApiErrorStatusMap;
    };
  }
}
