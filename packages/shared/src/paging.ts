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

const _emptyPageData: PageData<unknown> = {
  items: [],
  meta: {
    totalCount: 0,
  },
};

export function emptyPageData<T>() {
  return _emptyPageData as PageData<T>;
}
