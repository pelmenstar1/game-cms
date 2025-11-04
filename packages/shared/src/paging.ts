export type PagingOptions = {
  offset?: number;
  size: number;
};

export type PageData<T> = {
  items: T[];
  meta: {
    totalCount: number;
  };
};
