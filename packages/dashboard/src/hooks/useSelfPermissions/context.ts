import type { ApiRouteId } from '@game-cms/core/api';
import React from 'react';

export type PermissionsContextType = {
  permissions: Set<ApiRouteId>;
};

export const PermissionsContext =
  React.createContext<PermissionsContextType | null>(null);
