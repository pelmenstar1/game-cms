import { mergeObjects } from '@game-cms/shared/object';
import { describe, expect, test } from 'vitest';

import { ConditionalAstExpression, ConditionalBinaryOperator } from '../ast.js';
import { evaluateConditionalExpression } from '../eval.js';
import { parseConditionalNotation } from '../parser.js';
import { conditionalAstExpressionToString } from '../stringifier.js';
import type { ConditionalValueInput } from '../types.js';

type Expr = {
  text: string;
  expr: ConditionalAstExpression;
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

function makeGen(rng: () => number) {
  type CompOp = {
    sym: string;
    op: ConditionalBinaryOperator;
    fn: (a: number, b: number) => boolean;
  };

  let seq = 0;
  const freshVar = (): string => `v${seq++}`;

  const WORDS = ['foo', 'bar', 'baz', 'qux', 'alpha', 'beta'] as const;

  const COMP_OPS: CompOp[] = [
    { sym: '<', op: 'lt', fn: (a, b) => a < b },
    { sym: '<=', op: 'lte', fn: (a, b) => a <= b },
    { sym: '>', op: 'gt', fn: (a, b) => a > b },
    { sym: '>=', op: 'gte', fn: (a, b) => a >= b },
  ];

  function numLit(): NumericExpr {
    const n = randInt(0, 99, rng);
    const text = String(n);

    return {
      text: text,
      expr: { $type: 'literal', value: text },
      vars: {},
      oracle: text,
      numVal: n,
    };
  }

  function strLit(): Expr {
    const v = pick(WORDS, rng);

    return {
      text: `'${v}'`,
      expr: { $type: 'literal', value: v },
      vars: {},
      oracle: v,
    };
  }

  function boolVar(): Expr {
    const name = freshVar();
    const val = rng() < 0.5;

    return {
      text: `$${name}`,
      expr: { $type: 'var', name },
      vars: { [name]: val },
      oracle: val,
    };
  }

  function numVar(): NumericExpr {
    const name = freshVar();
    const n = randInt(0, 99, rng);

    return {
      text: `$${name}`,
      expr: { $type: 'var', name },
      vars: { [name]: n },
      oracle: n,
      numVal: n,
    };
  }

  function strVar(): Expr {
    const name = freshVar();
    const v = pick(WORDS, rng);

    return {
      text: `$${name}`,
      expr: { $type: 'var', name },
      vars: { [name]: v },
      oracle: v,
    };
  }

  function anyAtom(): Expr {
    const gen = pick([numLit, strLit, numVar, strVar], rng);

    return gen();
  }

  function numericOperand(): NumericExpr {
    return rng() < 0.5 ? numLit() : numVar();
  }

  function boolExpr(depth: number): Expr {
    type Generator = () => Expr;

    if (depth === 0) return boolVar();

    const generators: Generator[] = [
      () => boolVar(),
      // unary not
      () => {
        const inner = boolExpr(depth - 1);
        return {
          text: `!(${inner.text})`,
          expr: { $type: 'unary', operator: 'not', expr: inner.expr },
          vars: inner.vars,
          oracle: !(inner.oracle as boolean),
        };
      },
      // numeric comparison
      () => {
        const l = numericOperand();
        const r = numericOperand();
        const op = pick(COMP_OPS, rng);

        return {
          text: `(${l.text}${op.sym}${r.text})`,
          expr: {
            $type: 'binary',
            operator: op.op,
            lhs: l.expr,
            rhs: r.expr,
          },
          vars: mergeObjects([l.vars, r.vars]),
          oracle: op.fn(l.numVal, r.numVal),
        };
      },
      // equality / inequality
      () => {
        const genAtom = pick([numLit, strLit, numVar, strVar], rng);

        const l = genAtom();
        const r = genAtom();
        const eq = rng() < 0.5;

        return {
          text: `(${l.text}${eq ? '==' : '!='}${r.text})`,
          expr: {
            $type: 'binary',
            operator: eq ? 'eq' : 'neq',
            lhs: l.expr,
            rhs: r.expr,
          },
          vars: mergeObjects([l.vars, r.vars]),
          oracle: eq ? l.oracle === r.oracle : l.oracle !== r.oracle,
        };
      },
      // logical
      () => {
        const l = boolExpr(depth - 1);
        const r = boolExpr(depth - 1);

        const lValue = l.oracle as boolean;
        const rValue = r.oracle as boolean;

        const isAnd = rng() < 0.5;
        const textOp = isAnd ? '&&' : '||';
        const operator = isAnd ? 'and' : 'or';

        return {
          text: `(${l.text} ${textOp} ${r.text})`,
          expr: { $type: 'binary', operator, lhs: l.expr, rhs: r.expr },
          vars: mergeObjects([l.vars, r.vars]),
          oracle: isAnd ? lValue && rValue : lValue || rValue,
        };
      },
    ];

    const gen = pick(generators, rng);

    return gen();
  }

  return { boolExpr, anyAtom };
}

function assertExpr(expr: Expr, label: string): void {
  const errorMessage = `${label} source: ${expr.text}; vars: ${JSON.stringify(expr.vars)}; oracle: ${expr.oracle}`;

  try {
    const ast = parseConditionalNotation(expr.text);

    expect(ast, `${errorMessage}; AST: ${JSON.stringify(ast)}`).toEqual(
      expr.expr
    );

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
  for (let depth = 1; depth <= 10; depth++) {
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
