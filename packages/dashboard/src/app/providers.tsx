import { NotificationWrapper, useModal } from '@game-cms/ui';
import type { PropsWithChildren } from 'react';

import { useComponentHub } from '@/hooks/useComponentHub';

import { useApiClient } from '../hooks/useApiClient';
import { useStylesheetInject } from '../hooks/useStylesheetInject';

export function Providers({ children }: PropsWithChildren) {
  return (
    <useStylesheetInject.Provider>
      <useModal.Provider>
        <NotificationWrapper>
          <useApiClient.Provider>
            <useComponentHub.Provider>{children}</useComponentHub.Provider>
          </useApiClient.Provider>
        </NotificationWrapper>
      </useModal.Provider>
    </useStylesheetInject.Provider>
  );
}
