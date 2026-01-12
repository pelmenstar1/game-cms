import { NotificationWrapper, useModal } from '@game-cms/ui';
import type { PropsWithChildren } from 'react';

import { ApiClientProvider } from '@/context/apiClient';
import { useComponentHub } from '@/hooks/useComponentHub';
import { useSelfPermissions } from '@/hooks/useSelfPermissions';

export function Providers({ children }: PropsWithChildren) {
  return (
    <NotificationWrapper>
      <ApiClientProvider>
        <useComponentHub.Provider>
          <useModal.Provider>
            <useSelfPermissions.Provider>
              {children}
            </useSelfPermissions.Provider>
          </useModal.Provider>
        </useComponentHub.Provider>
      </ApiClientProvider>
    </NotificationWrapper>
  );
}
