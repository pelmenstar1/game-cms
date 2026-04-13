import { useTypedNavigate } from '@game-cms/ui';
import { useEffect } from 'react';

import { useClientConfig } from '../../hooks/useClientConfig.js';

export default function Page() {
  const clientConfigResult = useClientConfig();

  const navigate = useTypedNavigate();

  useEffect(() => {
    if (clientConfigResult.status === 'success') {
      const tabs = clientConfigResult.value.dashboard?.settings?.tabs ?? [];
      const [firstTab] = tabs;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (firstTab) {
        void navigate(firstTab.href);
      }
    }
  }, [clientConfigResult, navigate]);

  return <div></div>;
}
