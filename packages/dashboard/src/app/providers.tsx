import { ModalProvider, NotificationWrapper } from '@game-cms/ui';
import type { PropsWithChildren } from 'react';

import { ApiClientProvider } from '@/context/ApiClientProvider';
import { EntitySchemaProvider } from '@/context/EntitySchemaProvider';
import { ComponentHubProvider } from '@/hooks/useComponentHub';
import { SessionProvider } from '@/hooks/useSession';

export function Providers({ children }: PropsWithChildren) {
  return (
    <NotificationWrapper>
      <ApiClientProvider>
        <EntitySchemaProvider>
          <ComponentHubProvider>
            <ModalProvider>
              <SessionProvider>{children}</SessionProvider>
            </ModalProvider>
          </ComponentHubProvider>
        </EntitySchemaProvider>
      </ApiClientProvider>
    </NotificationWrapper>
  );
}
