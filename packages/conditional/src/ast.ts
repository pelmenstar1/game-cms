import type z from 'zod';

import type {
  conditionalAstBinaryExpression,
  conditionalAstLiteralExpression,
  conditionalAstUnaryExpression,
  conditionalAstVariableExpression,
  conditionalBinaryOperator,
  conditionalUnaryOperator,
} from './schema/ast.js';

export type ConditionalBinaryOperator = z.infer<
  typeof conditionalBinaryOperator
>;

export type ConditionalUnaryOperator = z.infer<typeof conditionalUnaryOperator>;

export type ConditionalAstVariableExpression = z.infer<
  typeof conditionalAstVariableExpression
>;

export type ConditionalAstLiteralExpression = z.infer<
  typeof conditionalAstLiteralExpression
>;

export type ConditionalAstBinaryExpression = z.infer<
  typeof conditionalAstBinaryExpression
>;

export type ConditionalAstUnaryExpression = z.infer<
  typeof conditionalAstUnaryExpression
>;

export type ConditionalAstExpression =
  | ConditionalAstBinaryExpression
  | ConditionalAstLiteralExpression
  | ConditionalAstVariableExpression
  | ConditionalAstUnaryExpression;
