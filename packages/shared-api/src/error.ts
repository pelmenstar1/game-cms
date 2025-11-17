export enum ApiErrorCode {
  ENTITY_NOT_FOUND = 'base::entityNotFound',
  VALIDATION_ISSUE = 'base::validationIssue',
  UNAUTHORIZED = 'base::unauthorized',
  DUPLICATE = 'base::duplicate',
}

export class ApiError extends Error {
  code: ApiErrorCode | undefined;
  httpCode: number | undefined;
  details: unknown;

  constructor(
    message: string,
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
