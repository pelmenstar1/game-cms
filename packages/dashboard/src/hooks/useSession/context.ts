import type { ApiRouteId } from '@game-cms/core/api';
import React from 'react';

export type SessionContextType = {
  actorId: string | undefined;
  permissions: Set<ApiRouteId>;
  refresh: () => void;
};

export const SessionContext = React.createContext<SessionContextType | null>(
  null
);
