import { contextUseFactory } from '@game-cms/ui';

import { EntityErrorReportingContext } from './context';

export const useEntityErrorReporting = contextUseFactory(
  EntityErrorReportingContext,
  'EntityErrorReportingContext'
);
