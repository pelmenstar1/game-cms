import { FileExplorer } from '@game-cms/base-components/shared';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

import styles from './route.module.scss';

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  const folderId = searchParams.get('folderId') ?? undefined;

  const onFolderChanged = useCallback(
    (folderId: string | undefined) => {
      setSearchParams(folderId ? { folderId } : {});
    },
    [setSearchParams]
  );

  return (
    <FileExplorer
      className={styles.root}
      folderId={folderId}
      onFolderChanged={onFolderChanged}
      multiple
    />
  );
}
