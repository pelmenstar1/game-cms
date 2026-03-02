import { useClientConfig } from '@game-cms/base-components/micro';
import { PageUrl, useTypedNavigate } from '@game-cms/ui';
import { useEffect } from 'react';

export default function Page() {
  const clientConfigResult = useClientConfig();

  const navigate = useTypedNavigate();

  useEffect(() => {
    if (clientConfigResult.status === 'success') {
      const tabs = clientConfigResult.value.settings?.tabs ?? {};

      void navigate(Object.values(tabs)[0].href as PageUrl);
    }
  }, [clientConfigResult, navigate]);

  return <div></div>;
}
