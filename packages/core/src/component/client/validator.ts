import { ComponentClientOptionsById, ComponentId } from '../types.js';
import {
  ComponentDataValidatorParams,
  ComponentDataValidatorResult,
} from '../validation.js';

export type ForeignComponentClientValidationContext = {
  validate: <Id extends ComponentId, Args>(
    id: Id,
    data: unknown, // ComponentClientDataById<Id, Args>
    options: ComponentClientOptionsById<Id, Args>,
    params?: ComponentDataValidatorParams
  ) => ComponentDataValidatorResult<Id, Args>;
};

export type ComponentClientDataValidator<Id extends ComponentId> = <
  Args = unknown,
>(
  data: unknown, // ComponentClientDataById<Id, Args>
  options: ComponentClientOptionsById<Id, Args>,
  context: ForeignComponentClientValidationContext,
  params?: ComponentDataValidatorParams
) => ComponentDataValidatorResult<Id, Args>;
