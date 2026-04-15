export type ApiErrorCodePath<T> = T extends string
  ? T
  : T extends string[]
    ? T[number]
    : {
        [K in keyof T & string]: `${K}/${ApiErrorCodePath<T[K]>}`;
      }[keyof T & string];

export interface ApiErrorCodeMap {}

type BaseApiErrorCode = {
  [NS in keyof ApiErrorCodeMap]: `${NS}::${ApiErrorCodePath<ApiErrorCodeMap[NS]>}`;
}[keyof ApiErrorCodeMap];

export type ApiErrorCode = BaseApiErrorCode extends never
  ? string
  : BaseApiErrorCode;

export type ApiErrorCodeTypeMap<T> = Partial<Record<ApiErrorCode, T>>;

export type ApiErrorStatusMap = ApiErrorCodeTypeMap<number>;

export type ApiErrorArgs = {
  code?: ApiErrorCode;
  httpCode?: number;
  details?: unknown;
  options?: ErrorOptions;
};

export class ApiError extends Error {
  code: ApiErrorCode | undefined;
  httpCode: number | undefined;
  details: unknown;

  constructor(message: string, args?: ApiErrorArgs) {
    super(message, args?.options);

    if (args) {
      this.details = args.details;
      this.code = args.code;
      this.httpCode = args.httpCode;
    }
  }
}
