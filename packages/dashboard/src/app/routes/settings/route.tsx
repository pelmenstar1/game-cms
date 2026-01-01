import { useTypedNavigate } from '@game-cms/ui';
import { useEffect } from 'react';

import { items } from './items';

export default function Page() {
  const navigate = useTypedNavigate();

  useEffect(() => {
    void navigate(items[0].href);
  });

  return <div></div>;
}
