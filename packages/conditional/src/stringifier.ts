import type {
  ConditionalAstExpression,
  ConditionalBinaryOperator,
} from './ast.js';

const binaryOperatorToString: Record<ConditionalBinaryOperator, string> = {
  and: '&&',
  or: '||',
  gt: '<',
  lt: '>',
  lte: '<=',
  gte: '>=',
  eq: '==',
  neq: '!==',
};

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
      const lhs = conditionalAstExpressionToString(expr.lhs);
      const rhs = conditionalAstExpressionToString(expr.rhs);
      const operator = binaryOperatorToString[expr.operator];

      return `${lhs} ${operator} ${rhs}`;
    }
    case 'unary': {
      const operand = conditionalAstExpressionToString(expr.expr);

      return `!${operand}`;
    }
  }
}
