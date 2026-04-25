import { expect as chaiExpect } from 'chai';

function matchesObject(actual: unknown, expected: unknown): boolean {
  if (expected === null || typeof expected !== 'object') {
    return actual === expected;
  }
  if (actual === null || typeof actual !== 'object') return false;

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) {
      return false;
    }

    return expected.every((v, i) => matchesObject(actual[i], v));
  }

  const act = actual as Record<string, unknown>;
  const exp = expected as Record<string, unknown>;
  return Object.keys(exp).every((k) => matchesObject(act[k], exp[k]));
}

interface Matchers {
  toBe(expected: unknown): void;
  toBeNull(): void;
  toBeDefined(): void;
  toBeUndefined(): void;
  toBeGreaterThan(n: number): void;
  toBeGreaterThanOrEqual(n: number): void;
  toEqual(expected: unknown): void;
  toMatchObject(expected: object): void;
  toBeInstanceOf(cls: abstract new (...args: never) => unknown): void;
  toThrow(ErrorClass?: abstract new (...args: never) => Error): void;
}

interface Expectation extends Matchers {
  not: Matchers;
  rejects: {
    toBeDefined(): Promise<void>;
    toThrow(ErrorClass?: abstract new (...args: never) => Error): Promise<void>;
  };
  resolves: {
    toBeUndefined(): Promise<void>;
    not: { toThrow(): Promise<void> };
  };
}

function matchers(actual: unknown, negated: boolean): Matchers {
  const a = () => (negated ? chaiExpect(actual).not : chaiExpect(actual));

  return {
    toBe(expected) {
      a().equal(expected);
    },
    toBeNull() {
      a().equal(null);
    },
    toBeDefined() {
      if (negated) {
        chaiExpect(actual).to.equal(undefined);
      } else {
        chaiExpect(actual).to.not.equal(undefined);
      }
    },
    toBeUndefined() {
      if (negated) {
        chaiExpect(actual).to.not.equal(undefined);
      } else {
        chaiExpect(actual).to.equal(undefined);
      }
    },
    toBeGreaterThan(n) {
      a().greaterThan(n);
    },
    toBeGreaterThanOrEqual(n) {
      a().greaterThanOrEqual(n);
    },
    toEqual(expected) {
      a().deep.equal(expected);
    },
    toMatchObject(expected) {
      const matches = matchesObject(actual, expected);
      if (negated) {
        chaiExpect(matches, 'expected not to match object').to.equal(false);
      } else {
        chaiExpect(matches, 'expected to match object').to.equal(true);
      }
    },
    toBeInstanceOf(cls) {
      a().instanceOf(cls);
    },
    toThrow(ErrorClass?) {
      if (ErrorClass) {
        a().throw(ErrorClass);
      } else {
        a().throw();
      }
    },
  };
}

export function expect(actual: unknown): Expectation {
  return {
    ...matchers(actual, false),
    not: matchers(actual, true),
    rejects: {
      async toBeDefined() {
        try {
          await (actual as Promise<unknown>);
          chaiExpect.fail('Expected promise to reject');
        } catch (error) {
          chaiExpect(error).to.not.equal(undefined);
        }
      },
      async toThrow(ErrorClass?) {
        try {
          await (actual as Promise<unknown>);
          chaiExpect.fail('Expected promise to reject');
        } catch (error) {
          if (ErrorClass && !(error instanceof ErrorClass)) {
            chaiExpect.fail(
              `Expected to reject with ${ErrorClass.name}, got ${(error as Error).constructor.name}`
            );
          }
        }
      },
    },
    resolves: {
      async toBeUndefined() {
        const result = await (actual as Promise<unknown>);
        chaiExpect(result).to.equal(undefined);
      },
      not: {
        async toThrow() {
          try {
            await (actual as Promise<unknown>);
          } catch (error) {
            chaiExpect.fail(
              `Expected promise not to throw, but threw: ${(error as Error).message}`
            );
          }
        },
      },
    },
  };
}
