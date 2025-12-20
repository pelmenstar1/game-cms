import z from 'zod';

export const conditionalBinaryOperator = z.enum([
  'and',
  'or',
  'eq',
  'neq',
  'lt',
  'lte',
  'gt',
  'gte',
]);

export const conditionalUnaryOperator = z.literal('not');

export const conditionalAstVariableExpression = z.object({
  $type: z.literal('var'),
  name: z.string(),
});

export const conditionalAstLiteralExpression = z.object({
  $type: z.literal('literal'),
  value: z.string(),
});

export const conditionalAstBinaryExpression = z.object({
  $type: z.literal('binary'),
  operator: conditionalBinaryOperator,
  get lhs() {
    return conditionalAstExpression;
  },
  get rhs() {
    return conditionalAstExpression;
  },
});

export const conditionalAstUnaryExpression = z.object({
  $type: z.literal('unary'),
  operator: conditionalUnaryOperator,
  get expr() {
    return conditionalAstExpression;
  },
});

export const conditionalAstExpression = z.union([
  conditionalAstVariableExpression,
  conditionalAstLiteralExpression,
  conditionalAstBinaryExpression,
  conditionalAstUnaryExpression,
]);
