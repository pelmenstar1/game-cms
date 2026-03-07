import { useTypedNavigate } from '@game-cms/ui';
import { useEffect } from 'react';

import { useClientConfig } from '../../hooks/useClientConfig.js';

export default function Page() {
  const clientConfigResult = useClientConfig();

  const navigate = useTypedNavigate();

  useEffect(() => {
    if (clientConfigResult.status === 'success') {
      const tabs = clientConfigResult.value.dashboard?.settings?.tabs ?? [];

      void navigate(tabs[0].href);
    }
  }, [clientConfigResult, navigate]);

  return <div></div>;
}
