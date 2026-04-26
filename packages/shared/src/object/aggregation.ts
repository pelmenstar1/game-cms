type EntryArray<T extends object> = [keyof T & string, T[keyof T & string]][];
type AnyEntry = [string, unknown];
type AnyOp = (entries: AnyEntry[]) => AnyEntry[];

interface OpNode {
  op: AnyOp;
  next: OpNode | null;
  head: OpNode;
}

type EntryFn<T, R> = (value: T[keyof T & string], key: keyof T & string) => R;

type ObjectAggregation<T> = {
  map<U>(fn: EntryFn<T, U>): ObjectAggregation<Record<keyof T & string, U>>;
  filter(fn: EntryFn<T, boolean>): ObjectAggregation<T>;
  result(): T;
};

export function objectAggregation<T extends object>(input: T) {
  function build<R extends object>(tail: OpNode | null): ObjectAggregation<R> {
    type Key = keyof R & string;

    function append(op: AnyOp): OpNode {
      const node = { op, next: null } as OpNode;

      if (tail === null) {
        node.head = node;
      } else {
        node.head = tail.head;
        tail.next = node;
      }

      return node;
    }

    return {
      map<U>(fn: EntryFn<R, U>) {
        return build<Record<Key, U>>(
          append((entries) =>
            (entries as EntryArray<R>).map(([k, v]) => [k, fn(v, k)])
          )
        );
      },

      filter(fn) {
        return build<R>(
          append((entries) =>
            (entries as EntryArray<R>).filter(([k, v]) => fn(v, k))
          )
        );
      },

      result() {
        let entries = Object.entries(input);
        let node = tail !== null ? tail.head : null;

        while (node !== null) {
          entries = node.op(entries);
          node = node.next;
        }

        return Object.fromEntries(entries) as R;
      },
    };
  }

  return build<T>(null);
}
