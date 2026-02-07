import React, { type ComponentType } from 'react';

export function namedLazy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, ComponentType<any>>,
  K extends keyof T,
>(factory: () => Promise<T>, name: K) {
  return React.lazy(async () => {
    const module = await factory();

    return { default: module[name] };
  });
}
