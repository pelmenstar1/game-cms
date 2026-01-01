export type SuccessQueryResult<T = unknown> = {
  status: 'success';
  value: T;
};

export type QueryResult<T = unknown> =
  | {
      status: 'pending';
    }
  | {
      status: 'error';
      error: unknown;
    }
  | SuccessQueryResult<T>;

export type QueryStatus = QueryResult['status'];

export type InferQueryResult<T> =
  T extends SuccessQueryResult<infer R> ? R : never;
