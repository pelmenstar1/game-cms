import type { Or } from '../typeutil.js';

export type SizedIterable<T> = Iterable<T> &
  Or<{ length: number }, { size: number }>;
