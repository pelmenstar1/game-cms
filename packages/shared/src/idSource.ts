export type IdSource<T> = () => T;

let counter = 0;

export const incrementingIdSource: IdSource<number> = () => counter++;
