import { NotificationWrapper } from '@game-cms/ui';
import type { PropsWithChildren } from 'react';

import { useApiClient } from '@/hooks/useApiClient';
import { useStylesheetInject } from '@/hooks/useStylesheetInject';

export function Providers({ children }: PropsWithChildren) {
  return (
    <useStylesheetInject.Provider>
      <NotificationWrapper>
        <useApiClient.Provider>{children}</useApiClient.Provider>
      </NotificationWrapper>
    </useStylesheetInject.Provider>
  );
}
