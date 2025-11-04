export type PageData<T> = {
  items: T[];
  meta: {
    totalCount: number;
  };
};
