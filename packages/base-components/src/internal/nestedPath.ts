import { ComponentPathDetails } from '@game-cms/core';

export type NestedPathDot<
  Details extends ComponentPathDetails,
  Prefix extends string,
> = Details['path'] extends string
  ? { path: `${Prefix}.${Details['path']}`; value: Details['value'] }
  : never;
