import { type Context, type FC, type ReactNode, useContext } from 'react';

type HookWithContextAndProvider<T> = {
  (): T;
  Context: Context<T>;
  Provider: FC<{ children: ReactNode }>;
};

export function createContextHook<T, R>(
  context: Context<T | null>,
  provider: FC<{ children: ReactNode }>,
  mapping: (value: T) => R
): HookWithContextAndProvider<R>;

export function createContextHook<T>(
  context: Context<T | null>,
  provider: FC<{ children: ReactNode }>
): HookWithContextAndProvider<T>;

export function createContextHook<T, R>(
  context: Context<T | null>,
  provider: FC<{ children: ReactNode }>,
  mapping?: (value: T) => R
) {
  function useGivenContext() {
    const result = useContext(context);
    if (result === null) {
      throw new Error(`Provider for ${context.displayName} is not in the tree`);
    }

    return mapping ? mapping(result) : result;
  }

  useGivenContext.Context = context;
  useGivenContext.Provider = provider;

  return useGivenContext;
}
