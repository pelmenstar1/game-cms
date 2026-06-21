import { type MaybeFactory, resolveMaybeFactory } from './maybeFactory.js';

export type IdSource<T> = () => T;

let counter = 0;

export const incrementingIdSource: IdSource<number> = () => counter++;

export const datePrefixSource = (prefix: string) => () =>
  `${prefix}-${Date.now().toString(36)}`;

export const prefixedIdSource = (
  prefixSource: MaybeFactory<string>
): IdSource<string> => {
  let prefix: string | undefined;
  let counter = 0;

  return () => {
    prefix ??= resolveMaybeFactory(prefixSource);

    return `${prefix}-${counter++}`;
  };
};
