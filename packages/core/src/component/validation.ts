import { FilePortal } from '@game-cms/shared';
import type z from 'zod';

import { ApiClient } from '../api/client/types.js';
import type { componentDataValidatorParams } from '../schema/component/validation.js';
import { ComponentErrorById, ComponentId } from './types.js';

export type ComponentDataValidatorParams = z.infer<
  typeof componentDataValidatorParams
>;

export type ComponentDataCustomClientValidatorContext = {
  apiClient: ApiClient;
};

export type ComponentDataValidatorResult<Id extends ComponentId, Args> =
  ComponentErrorById<Id, Args> | undefined;

export interface ComponentDataCustomClientValidator<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> {
  check: (
    data: unknown, // ComponentInDataById<Id, Args>
    context: ComponentDataCustomClientValidatorContext,
    params?: ComponentDataValidatorParams
  ) => ComponentDataValidatorResult<Id, Args>;
}

export interface ComponentDataCustomValidator<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> {
  clientConnector: FilePortal;

  check: (
    data: unknown, // ComponentInDataById<Id, Args>
    params?: ComponentDataValidatorParams
  ) => ComponentDataValidatorResult<Id, Args>;
}

export type ComponentDataCustomValidatorClientConnector = {
  getClientValidator: (id: string) => ComponentDataCustomClientValidator;
};

export function defineComponentDataCustomValidatorClientConnector(
  value: ComponentDataCustomValidatorClientConnector
) {
  return value;
}
