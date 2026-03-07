import {
  ClientConfigContext,
  ClientConfigContextType,
} from '@game-cms/base-components/shared';
import { PropsWithChildren, useMemo } from 'react';

import { getClientConfig } from '@/connector/clientConfig';

export function ClientConfigProvider({ children }: PropsWithChildren) {
  const context = useMemo(
    (): ClientConfigContextType => ({
      getClientConfig,
    }),
    []
  );

  return (
    <ClientConfigContext.Provider value={context}>
      {children}
    </ClientConfigContext.Provider>
  );
}
