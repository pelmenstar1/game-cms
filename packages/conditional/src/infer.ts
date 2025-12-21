import type { ConditionalAstExpression } from './ast.js';

type OutputType = 'boolean' | 'string' | 'dependsOnVar';

export function inferExpressionOutput(
  expression: ConditionalAstExpression
): OutputType {
  switch (expression.$type) {
    case 'binary':
    case 'unary': {
      return 'boolean';
    }
    case 'literal': {
      return 'string';
    }
    case 'var': {
      return 'dependsOnVar';
    }
  }
}
