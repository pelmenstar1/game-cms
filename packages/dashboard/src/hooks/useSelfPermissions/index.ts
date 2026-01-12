import { createContextHook } from '@game-cms/ui';

import { PermissionsContext } from './context';
import { PermissionsProvider } from './provider';

export const useSelfPermissions = createContextHook(
  PermissionsContext,
  PermissionsProvider,
  ({ permissions }) => permissions
);
