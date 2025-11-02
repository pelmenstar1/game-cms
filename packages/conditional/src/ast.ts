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

export const condtionalAstVariableExpression = z.object({
  $type: z.literal('var'),
  name: z.string(),
});

export const condtionalAstLiteralExpression = z.object({
  $type: z.literal('literal'),
  value: z.string(),
});

export const condtionalAstBinaryExpression = z.object({
  $type: z.literal('binary'),
  operator: conditionalBinaryOperator,
  get lhs() {
    return conditionalAstExpression;
  },
  get rhs() {
    return conditionalAstExpression;
  },
});

export const condtionalAstUnaryExpression = z.object({
  $type: z.literal('unary'),
  operator: conditionalUnaryOperator,
  get expr() {
    return conditionalAstExpression;
  },
});

export const conditionalAstExpression = z.union([
  condtionalAstVariableExpression,
  condtionalAstLiteralExpression,
  condtionalAstBinaryExpression,
  condtionalAstUnaryExpression,
]);

export type ConditionalBinaryOperator = z.infer<
  typeof conditionalBinaryOperator
>;

export type ConditionalUnaryOperator = z.infer<typeof conditionalUnaryOperator>;

export type ConditionalAstVariableExpression = z.infer<
  typeof condtionalAstVariableExpression
>;

export type ConditionalAstLiteralExpression = z.infer<
  typeof condtionalAstLiteralExpression
>;

export type ConditionalAstBinaryExpression = z.infer<
  typeof condtionalAstBinaryExpression
>;

export type ConditionalAstUnaryExpression = z.infer<
  typeof condtionalAstUnaryExpression
>;

export type ConditionalAstExpression =
  | ConditionalAstBinaryExpression
  | ConditionalAstLiteralExpression
  | ConditionalAstVariableExpression
  | ConditionalAstUnaryExpression;
