type Action<Args extends unknown[] = []> = (...args: Args) => void;

export function combineActions<Args extends unknown[]>(
  ...actions: Action<Args>[]
): Action<Args> {
  return (...args: Args) => {
    for (const action of actions) {
      action(...args);
    }
  };
}
