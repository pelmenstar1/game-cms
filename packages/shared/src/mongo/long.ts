import { Long } from 'mongodb';

export type MaybeLong = number | Long;

export function maybeLongAdd(a: MaybeLong, b: number): Long {
  return typeof a === 'number' ? Long.fromNumber(a + b) : a.add(b);
}
