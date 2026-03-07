import { rejectedPromiseFactory } from './promise.js';

function message(target: string) {
  return `${target} is not implemented`;
}

const _unimplemented = (target: string) => () => {
  throw new Error(message(target));
};

_unimplemented.async = (target: string) =>
  rejectedPromiseFactory(message(target));

export const unimplemented = _unimplemented;
