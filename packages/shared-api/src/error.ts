export enum ApiErrorCode {
  ENTITY_NOT_FOUND = 'base::entityNotFound',
  VALIDATION_ISSUE = 'base::validationIssue',
}

export class ApiError extends Error {
  code: ApiErrorCode | undefined;

  constructor(message: string, code: ApiErrorCode) {
    super(message);

    this.code = code;
  }
}
