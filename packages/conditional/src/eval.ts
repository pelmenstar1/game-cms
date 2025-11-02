import {
  type ConditionalAstExpression,
  type ConditionalBinaryOperator,
  type ConditionalUnaryOperator,
} from './ast.js';
import type {
  ConditionalValueInput,
  ConditionalValueInputAtom,
} from './types.js';

type UnaryOperatorMap = Record<
  ConditionalUnaryOperator,
  (x: boolean) => boolean
>;

type Binary<T> = (x: T, y: T) => boolean;

type BinaryOperator =
  | { action: Binary<ConditionalValueInputAtom>; only?: false }
  | {
      action: Binary<number>;
      only: 'number';
    }
  | {
      action: Binary<boolean>;
      only: 'boolean';
    };

type BinaryOperatorMap = Record<ConditionalBinaryOperator, BinaryOperator>;

const unaryOperators: UnaryOperatorMap = {
  not: (x) => !x,
};

const binaryOperators: BinaryOperatorMap = {
  and: { action: (x, y) => x && y, only: 'boolean' },
  or: { action: (x, y) => x || y, only: 'boolean' },
  lt: { action: (x, y) => x < y, only: 'number' },
  gt: { action: (x, y) => x > y, only: 'number' },
  lte: { action: (x, y) => x <= y, only: 'number' },
  gte: { action: (x, y) => x >= y, only: 'number' },
  eq: { action: (x, y) => x === y },
  neq: { action: (x, y) => x !== y },
};

function coerceToNumber(value: ConditionalValueInputAtom): number {
  switch (typeof value) {
    case 'number': {
      return value;
    }
    case 'string': {
      return Number.parseFloat(value);
    }
    default: {
      return Number.NaN;
    }
  }
}

function throwUnexpectedType(
  operator: string,
  lhs: unknown,
  rhs: unknown
): never {
  throw new TypeError(
    `Unexpected lhs or rhs for ${operator} operator: lhs = ${typeof lhs}, rhs = ${typeof rhs}`
  );
}

export function evaluateConditionalExpression(
  expression: ConditionalAstExpression,
  input: ConditionalValueInput
): string | number | boolean {
  switch (expression.$type) {
    case 'literal': {
      return expression.value;
    }
    case 'var': {
      const { name } = expression;
      const value = input[name];

      if (value === undefined) {
        throw new Error(`Unknown variable: ${name}`);
      }

      return value;
    }
    case 'unary': {
      const operator = unaryOperators[expression.operator];
      const value = evaluateConditionalExpression(expression.expr, input);

      if (typeof value !== 'boolean') {
        throw new TypeError(
          `Unexpected value type for ${expression.operator} operator: ${typeof value}`
        );
      }

      return operator(value);
    }
    case 'binary': {
      const operator = binaryOperators[expression.operator];
      const lhs = evaluateConditionalExpression(expression.lhs, input);
      const rhs = evaluateConditionalExpression(expression.rhs, input);

      switch (operator.only) {
        case 'boolean': {
          if (typeof lhs !== 'boolean' || typeof rhs === 'boolean') {
            throwUnexpectedType(expression.operator, lhs, rhs);
          }

          break;
        }
        case 'number': {
          const lhsCoerced = coerceToNumber(lhs);
          const rhsCoerced = coerceToNumber(rhs);

          if (Number.isNaN(lhsCoerced) || Number.isNaN(rhsCoerced)) {
            throwUnexpectedType(expression.operator, lhs, rhs);
          }

          break;
        }
      }

      return operator.action(lhs as never, rhs as never);
    }
  }
}
