export class FetchError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.status = status;
  }
}

export function isErrorWithStatus(
  error: unknown,
  status: number
): error is FetchError {
  return error instanceof FetchError && error.status === status;
}
