import { ModalProvider, NotificationWrapper } from '@game-cms/ui';
import type { PropsWithChildren } from 'react';

import { ApiClientProvider } from '@/context/ApiClientProvider';
import { ClientConfigProvider } from '@/context/ClientConfigProvider';
import { EntitySchemaProvider } from '@/context/EntitySchemaProvider';
import { ComponentHubProvider } from '@/hooks/useComponentHub';
import { SessionProvider } from '@/hooks/useSession';

export function Providers({ children }: PropsWithChildren) {
  return (
    <NotificationWrapper>
      <ApiClientProvider>
        <EntitySchemaProvider>
          <ComponentHubProvider>
            <ClientConfigProvider>
              <ModalProvider>
                <SessionProvider>{children}</SessionProvider>
              </ModalProvider>
            </ClientConfigProvider>
          </ComponentHubProvider>
        </EntitySchemaProvider>
      </ApiClientProvider>
    </NotificationWrapper>
  );
}
