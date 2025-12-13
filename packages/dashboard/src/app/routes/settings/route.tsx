import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { items } from './items';

export default function Page() {
  const navigate = useNavigate();

  useEffect(() => {
    void navigate(items[0].href);
  });

  return <div></div>;
}
