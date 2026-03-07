import { ModalProvider, NotificationWrapper } from '@game-cms/ui';
import type { PropsWithChildren } from 'react';

import { ApiClientProvider } from '@/context/ApiClientProvider';
import { ClientConfigProvider } from '@/context/ClientConfigProvider';
import { EntityCheckProvider } from '@/context/EntityCheckProvider';
import { EntitySchemaProvider } from '@/context/EntitySchemaProvider';
import { SessionProvider } from '@/context/SessionProvider';
import { ComponentHubProvider } from '@/hooks/useComponentHub';

export function Providers({ children }: PropsWithChildren) {
  return (
    <NotificationWrapper>
      <ApiClientProvider>
        <EntitySchemaProvider>
          <ComponentHubProvider>
            <ClientConfigProvider>
              <EntityCheckProvider>
                <ModalProvider>
                  <SessionProvider>{children}</SessionProvider>
                </ModalProvider>
              </EntityCheckProvider>
            </ClientConfigProvider>
          </ComponentHubProvider>
        </EntitySchemaProvider>
      </ApiClientProvider>
    </NotificationWrapper>
  );
}
