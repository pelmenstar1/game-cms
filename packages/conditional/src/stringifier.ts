import type {
  ConditionalAstExpression,
  ConditionalBinaryOperator,
} from './ast.js';

const binaryOperatorToString: Record<ConditionalBinaryOperator, string> = {
  and: '&&',
  or: '||',
  gt: '>',
  lt: '<',
  lte: '<=',
  gte: '>=',
  eq: '==',
  neq: '!=',
};

function needToWrapInParens(expr: ConditionalAstExpression): boolean {
  if (expr.$type === 'binary') {
    return true;
  }

  if (expr.$type === 'unary') {
    const operand = expr.expr;

    return operand.$type === 'binary';
  }

  return false;
}

function wrapInParensIfNeeded(expr: ConditionalAstExpression): string {
  const result = conditionalAstExpressionToString(expr);

  if (needToWrapInParens(expr)) {
    return `(${result})`;
  }

  return result;
}

export function conditionalAstExpressionToString(
  expr: ConditionalAstExpression
): string {
  switch (expr.$type) {
    case 'literal': {
      return `'${expr.value}'`;
    }
    case 'var': {
      return `$${expr.name}`;
    }
    case 'binary': {
      const lhs = wrapInParensIfNeeded(expr.lhs);
      const rhs = wrapInParensIfNeeded(expr.rhs);

      const operator = binaryOperatorToString[expr.operator];

      return `${lhs} ${operator} ${rhs}`;
    }
    case 'unary': {
      const operand = wrapInParensIfNeeded(expr.expr);

      return `!${operand}`;
    }
  }
}
