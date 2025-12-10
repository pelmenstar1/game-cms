import type { ApiErrorCode } from '@game-cms/base-types';

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
