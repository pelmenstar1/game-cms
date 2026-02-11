import { UnpackArray } from '@game-cms/shared';

export type DataEntry<Data, K> = {
  key: K;
  data: Data;
};

export type GetDataFromEntryArray<T, K> = Extract<
  UnpackArray<T>,
  DataEntry<unknown, K>
>['data'];
