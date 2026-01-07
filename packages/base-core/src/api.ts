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

export class ApiError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  code: ApiErrorCode | undefined;
  httpCode: number | undefined;
  details: unknown;

  constructor(
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    codes: ApiErrorCode | { api?: ApiErrorCode; http?: number },
    details?: unknown
  ) {
    super(message);

    this.details = details;

    if (typeof codes === 'string') {
      this.code = codes;
    } else {
      this.code = codes.api;
      this.httpCode = codes.http;
    }
  }
}

declare module '@game-cms/core' {
  interface PluginApiConfig {
    error?: {
      statuses?: ApiErrorStatusMap;
    };
  }
}
