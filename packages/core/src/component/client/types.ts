import { ResultOrError } from '@game-cms/shared';

import {
  ComponentErrorById,
  ComponentId,
  ComponentInDataById,
  GetComponentTypesById,
} from '../types.js';

export type ComponentClientDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['clientData'];

export type ComponentInDataOrError<
  Id extends ComponentId,
  Args = unknown,
> = ResultOrError<ComponentInDataById<Id, Args>, ComponentErrorById<Id, Args>>;
