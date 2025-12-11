import { NotificationWrapper } from '@game-cms/ui';
import type { PropsWithChildren } from 'react';

import { useApiClient } from '../hooks/useApiClient';
import { useModal } from '../hooks/useModal';
import { useStylesheetInject } from '../hooks/useStylesheetInject';

export function Providers({ children }: PropsWithChildren) {
  return (
    <useStylesheetInject.Provider>
      <useModal.Provider>
        <NotificationWrapper>
          <useApiClient.Provider>{children}</useApiClient.Provider>
        </NotificationWrapper>
      </useModal.Provider>
    </useStylesheetInject.Provider>
  );
}
