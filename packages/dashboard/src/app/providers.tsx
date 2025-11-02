import type { PropsWithChildren } from 'react';

import { StylesheetInject } from '@/components/StylesheetInject';
import { useApiClient } from '@/hooks/useApiClient';

export function Providers({ children }: PropsWithChildren) {
  return (
    <StylesheetInject>
      <useApiClient.Provider>{children}</useApiClient.Provider>
    </StylesheetInject>
  );
}
