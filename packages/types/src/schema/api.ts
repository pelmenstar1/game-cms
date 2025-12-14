import z from 'zod';

export const apiRouteId = z.templateLiteral([
  z.string(),
  z.literal('$'),
  z.string(),
]);
