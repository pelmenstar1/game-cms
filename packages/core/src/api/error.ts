import { FromEntries, GetPropertyOr } from '@game-cms/shared';

export interface ApiErrorCodeMap {}

export type ApiErrorTypeInfo<T = null> = {
  $INFO: T;
};

type RecursiveApiErrorFlatTypeMapTransition<
  T,
  Path extends string,
> = T extends {
  $INFO: infer Info;
}
  ? [Path, Info]
  : RecursiveApiErrorFlatTypeMap<T, Path>;

type RecursiveApiErrorFlatTypeMap<
  T,
  Path extends string,
  Delimiter extends string = '/',
> = {
  [K in keyof T & string]: RecursiveApiErrorFlatTypeMapTransition<
    T[K],
    `${Path}${Delimiter}${K}`
  >;
}[keyof T & string];

type ApiErrorFlatTypeMap = FromEntries<
  {
    [NS in keyof ApiErrorCodeMap]: RecursiveApiErrorFlatTypeMap<
      ApiErrorCodeMap[NS],
      NS,
      '::'
    >;
  }[keyof ApiErrorCodeMap]
>;

export type ApiErrorDetailsByCode<Code extends ApiErrorCode> = GetPropertyOr<
  GetPropertyOr<ApiErrorFlatTypeMap, Code, unknown>,
  'details',
  unknown
>;

type BaseApiErrorCode = keyof ApiErrorFlatTypeMap;

export type ApiErrorCode = BaseApiErrorCode extends never
  ? string
  : BaseApiErrorCode;

export type ApiErrorCodeTypeMap<T> = Partial<Record<ApiErrorCode, T>>;

export type ApiErrorStatusMap = ApiErrorCodeTypeMap<number>;

export type ApiErrorArgs<Code extends ApiErrorCode = ApiErrorCode> = {
  code?: Code;
  httpCode?: number;
  details?: ApiErrorDetailsByCode<Code>;
  options?: ErrorOptions;
};

export class ApiError<Code extends ApiErrorCode = ApiErrorCode> extends Error {
  code: Code | undefined;
  httpCode: number | undefined;
  details: ApiErrorDetailsByCode<Code> | undefined;

  constructor(message: string, args?: ApiErrorArgs<Code>) {
    super(message, args?.options);

    if (args) {
      this.details = args.details;
      this.code = args.code;
      this.httpCode = args.httpCode;
    }
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

export function isApiErrorOfCode<Code extends ApiErrorCode>(
  value: unknown,
  code: Code
): value is ApiError<Code> {
  return isApiError(value) && value.code === code;
}
