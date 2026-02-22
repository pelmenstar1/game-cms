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

const _emptyPageData: PageData<never> = {
  items: [],
  meta: {
    totalCount: 0,
  },
};

export function emptyPageData<T>(): PageData<T> {
  return _emptyPageData;
}
