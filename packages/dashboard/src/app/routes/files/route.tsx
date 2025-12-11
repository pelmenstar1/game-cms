import { useSearchParams } from 'react-router';

import { FileExplorer } from '@/components/FileExplorer';

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  return <FileExplorer />;
}
