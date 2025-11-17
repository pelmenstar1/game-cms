import { getEntitySchema } from '@game-cms/client';

import { AccessEntityView } from '@/components/AccessEntityView';
import { DataLoader } from '@/components/DataLoader';
import { useApiQuery } from '@/hooks/useApiQuery';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export default function Page({ params }: Route.ComponentProps) {
  const [entitySchema] = useApiQuery(getEntitySchema, [params.name], {
    redirectOnNotFound: true,
  });

  return (
    <DataLoader className={styles.root} result={entitySchema}>
      {(entitySchema) => <AccessEntityView schema={entitySchema} />}
    </DataLoader>
  );
}
