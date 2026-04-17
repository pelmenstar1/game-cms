import { ModalProvider, NotificationWrapper } from '@game-cms/ui';
import type { PropsWithChildren } from 'react';

import { ApiClientProvider } from '@/context/ApiClientProvider';
import { ClientConfigProvider } from '@/context/ClientConfigProvider';
import { EntityCheckProvider } from '@/context/EntityCheckProvider';
import { EntityHubProvider } from '@/context/EntityHubProvider';
import { EntitySchemaProvider } from '@/context/EntitySchemaProvider';
import { SessionProvider } from '@/context/SessionProvider';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ApiClientProvider>
      <EntitySchemaProvider>
        <EntityHubProvider>
          <ClientConfigProvider>
            <EntityCheckProvider>
              <SessionProvider>
                <ModalProvider>
                  <NotificationWrapper>{children}</NotificationWrapper>
                </ModalProvider>
              </SessionProvider>
            </EntityCheckProvider>
          </ClientConfigProvider>
        </EntityHubProvider>
      </EntitySchemaProvider>
    </ApiClientProvider>
  );
}
