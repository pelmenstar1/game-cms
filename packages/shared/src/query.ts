export type SuccessQueryResult<T = unknown> = {
  status: 'success';
  value: T;
};

export type QueryResult<T = unknown> =
  | SuccessQueryResult<T>
  | {
      status: 'pending';
    }
  | {
      status: 'error';
      error: unknown;
    };

export type QueryStatus = QueryResult['status'];

export type InferQueryResult<T> =
  T extends SuccessQueryResult<infer R> ? R : never;

const pendingResult: QueryResult = { status: 'pending' };

export function pendingQueryResult<T>() {
  return pendingResult as QueryResult<T>;
}
