import { Context, useContext } from 'react';

export function contextUseFactory<T>(
  context: Context<T | null>,
  name: string
): () => T {
  return () => {
    const value = useContext(context);
    if (value === null) {
      throw new Error(`${name} is not in the tree`);
    }

    return value;
  };
}
