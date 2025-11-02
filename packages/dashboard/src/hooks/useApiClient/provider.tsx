import { createStandardClient } from '@game-cms/client';
import { type PropsWithChildren, useMemo } from 'react';

import { ApiClientContext, type ApiClientContextType } from './context';

export function ApiClientProvider({ children }: PropsWithChildren) {
  const client = useMemo(() => createStandardClient({ baseUrl: `/api` }), []);
  const context = useMemo((): ApiClientContextType => ({ client }), [client]);

  return (
    <ApiClientContext.Provider value={context}>
      {children}
    </ApiClientContext.Provider>
  );
}
