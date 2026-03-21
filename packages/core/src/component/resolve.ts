import {
  ComponentNestedPath,
  ComponentNestedPathDetails,
  ComponentPathDetails,
} from './pathWalker.js';
import { ComponentSchema } from './schema.js';
import {
  ComponentId,
  ComponentOptionsById,
  ComponentOutDataById,
  GetComponentTypesById,
} from './types.js';

export type ComponentDataResolver<Id extends ComponentId> = <Args>(
  input: ComponentOutDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataResolverContext,
  args: ComponentDataResolverArgs
) => ComponentResolvedDataById<Id, Args>;

export type ComponentResolvedDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['resolvedData'];

export type ComponentSchemaNestedPath<T, Schema> =
  Schema extends ComponentSchema<infer Id, infer Args>
    ? ComponentNestedPath<T, Id, Args>
    : string;

export type ComponentSchemaNestedPathDetails<T, Schema> =
  Schema extends ComponentSchema<infer Id, infer Args>
    ? ComponentNestedPathDetails<T, Id, Args>
    : ComponentPathDetails;

export interface ComponentDataResolverArgs {}

export type ForeignComponentDataResolverContext = {
  resolveOutData: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentOutDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    args: ComponentDataResolverArgs
  ) => ComponentResolvedDataById<Id>;
};
