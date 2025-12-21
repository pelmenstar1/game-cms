import React from 'react';

export type EntityErrorReportingContextType = {
  setError: (path: string, value: unknown) => void;
};

export const EntityErrorReportingContext =
  React.createContext<EntityErrorReportingContextType | null>(null);
