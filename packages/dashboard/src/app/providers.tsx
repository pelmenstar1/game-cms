import { NotificationWrapper, useModal } from '@game-cms/ui';
import type { PropsWithChildren } from 'react';

import { ApiClientProvider } from '@/context/apiClient';
import { useComponentHub } from '@/hooks/useComponentHub';
import { useSelfSession } from '@/hooks/useSession';

export function Providers({ children }: PropsWithChildren) {
  return (
    <NotificationWrapper>
      <ApiClientProvider>
        <useComponentHub.Provider>
          <useModal.Provider>
            <useSelfSession.Provider>{children}</useSelfSession.Provider>
          </useModal.Provider>
        </useComponentHub.Provider>
      </ApiClientProvider>
    </NotificationWrapper>
  );
}
