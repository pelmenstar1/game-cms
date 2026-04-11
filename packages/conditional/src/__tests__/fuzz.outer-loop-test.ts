import { describe, expect, test } from 'vitest';

import { evaluateConditionalExpression } from '../eval.js';
import { parseConditionalNotation } from '../parser.js';
import { conditionalAstExpressionToString } from '../stringifier.js';
import type { ConditionalValueInput } from '../types.js';

type Expr = {
  source: string;
  vars: ConditionalValueInput;
  oracle: string | number | boolean;
};

type NumericExpr = Expr & { numVal: number };

function createRng(seed: number) {
  let s = (seed | 1) >>> 0;

  return (): number => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(lo: number, hi: number, rng: () => number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

function mergeVars(...maps: ConditionalValueInput[]): ConditionalValueInput {
  let out: ConditionalValueInput = {};
  for (const m of maps) {
    out = { ...out, ...m };
  }

  return out;
}

function makeGen(rng: () => number) {
  let seq = 0;
  const freshVar = (): string => `v${seq++}`;

  const WORDS = ['foo', 'bar', 'baz', 'qux', 'alpha', 'beta'] as const;

  const COMP_OPS = [
    { sym: '<', fn: (a: number, b: number): boolean => a < b },
    { sym: '<=', fn: (a: number, b: number): boolean => a <= b },
    { sym: '>', fn: (a: number, b: number): boolean => a > b },
    { sym: '>=', fn: (a: number, b: number): boolean => a >= b },
  ] as const;

  function numLit(): NumericExpr {
    const n = randInt(0, 99, rng);

    return { source: String(n), vars: {}, oracle: String(n), numVal: n };
  }

  function strLit(): Expr {
    const v = pick(WORDS, rng);

    return { source: `'${v}'`, vars: {}, oracle: v };
  }

  function boolVar(): Expr {
    const name = freshVar();
    const val = rng() < 0.5;

    return { source: `$${name}`, vars: { [name]: val }, oracle: val };
  }

  function numVar(): NumericExpr {
    const name = freshVar();
    const n = randInt(0, 99, rng);

    return { source: `$${name}`, vars: { [name]: n }, oracle: n, numVal: n };
  }

  function strVar(): Expr {
    const name = freshVar();
    const v = pick(WORDS, rng);

    return { source: `$${name}`, vars: { [name]: v }, oracle: v };
  }

  function anyAtom(): Expr {
    const r = rng();
    if (r < 0.25) return numLit();
    if (r < 0.5) return strLit();
    if (r < 0.75) return numVar();

    return strVar();
  }

  function numericOperand(): NumericExpr {
    return rng() < 0.5 ? numLit() : numVar();
  }

  function boolExpr(depth: number): Expr {
    if (depth === 0) return boolVar();

    const roll = rng();

    // leaf
    if (roll < 0.05) return boolVar();

    // unary not
    if (roll < 0.15) {
      const inner = boolExpr(depth - 1);
      return {
        source: `!(${inner.source})`,
        vars: inner.vars,
        oracle: !(inner.oracle as boolean),
      };
    }

    // numeric comparison
    if (roll < 0.3) {
      const l = numericOperand();
      const r = numericOperand();
      const op = pick(COMP_OPS, rng);
      return {
        source: `(${l.source}${op.sym}${r.source})`,
        vars: mergeVars(l.vars, r.vars),
        oracle: op.fn(l.numVal, r.numVal),
      };
    }

    // equality / inequality – same atom generator on both sides keeps oracle
    // types consistent and produces a realistic true/false split
    if (roll < 0.4) {
      const genAtom = pick([numLit, strLit, numVar, strVar] as const, rng);
      const l = genAtom();
      const r = genAtom();
      const eq = rng() < 0.5;
      return {
        source: `(${l.source}${eq ? '==' : '!='}${r.source})`,
        vars: mergeVars(l.vars, r.vars),
        oracle: eq ? l.oracle === r.oracle : l.oracle !== r.oracle,
      };
    }

    // logical and
    if (roll < 0.7) {
      const l = boolExpr(depth - 1);
      const r = boolExpr(depth - 1);
      return {
        source: `(${l.source} && ${r.source})`,
        vars: mergeVars(l.vars, r.vars),
        oracle: (l.oracle as boolean) && (r.oracle as boolean),
      };
    }

    // logical or
    const l = boolExpr(depth - 1);
    const r = boolExpr(depth - 1);
    return {
      source: `(${l.source} || ${r.source})`,
      vars: mergeVars(l.vars, r.vars),
      oracle: (l.oracle as boolean) || (r.oracle as boolean),
    };
  }

  return { boolExpr, anyAtom };
}

function assertExpr(expr: Expr, label: string): void {
  const errorMessage = `${label}\n  source : ${expr.source}\n  vars   : ${JSON.stringify(expr.vars)}\n  oracle : ${expr.oracle}`;

  try {
    const ast = parseConditionalNotation(expr.source);
    const evalResult = evaluateConditionalExpression(ast, expr.vars);

    expect(evalResult).toEqual(expr.oracle);

    const stringified = conditionalAstExpressionToString(ast);
    const reParsed = parseConditionalNotation(stringified);

    expect(reParsed, `stringified: ${stringified}`).toEqual(ast);
  } catch (error) {
    throw new Error(errorMessage, {
      cause: error,
    });
  }
}

const SEED = 0xc0ffee;

describe('fuzz: random boolean expressions', () => {
  for (let depth = 1; depth <= 5; depth++) {
    describe(`depth ${depth}`, () => {
      const rng = createRng(SEED + depth);
      const gen = makeGen(rng);

      for (let i = 0; i < 500; i++) {
        test(`iteration ${i}`, () => {
          assertExpr(gen.boolExpr(depth), `[depth=${depth}, iter=${i}]`);
        });
      }
    });
  }
});

// describe('fuzz: equality over mixed-type atoms', () => {
//   const rng = createRng(SEED + 100);
//   const gen = makeGen(rng);

//   for (let i = 0; i < 300; i++) {
//     test(`iteration ${i}`, () => {
//       const l = gen.anyAtom();
//       const r = gen.anyAtom();
//       const eq = rng() < 0.5;

//       assertExpr(
//         {
//           source: `(${l.source}${eq ? '==' : '!='}${r.source})`,
//           vars: mergeVars(l.vars, r.vars),
//           oracle: eq ? l.oracle === r.oracle : l.oracle !== r.oracle,
//         },
//         `[iter=${i}]`
//       );
//     });
//   }
// });
