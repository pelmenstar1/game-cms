export enum ApiErrorCode {
  ENTITY_NOT_FOUND = 'base::entityNotFound',
  VALIDATION_ISSUE = 'base::validationIssue',
  UNAUTHORIZED = 'base::unauthorized',
  DUPLICATE = 'base::duplicate',
}

export class ApiError extends Error {
  code: ApiErrorCode | undefined;
  details: unknown;

  constructor(message: string, code: ApiErrorCode, details?: unknown) {
    super(message);

    this.code = code;
    this.details = details;
  }
}
