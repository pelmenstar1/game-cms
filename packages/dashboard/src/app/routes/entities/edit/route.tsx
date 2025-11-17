import { getEntityById, getEntitySchema } from '@game-cms/client';

import { AccessEntityView } from '@/components/AccessEntityView';
import { MultipleDataLoader } from '@/components/MultipleDataLoader';
import { useApiQuery } from '@/hooks/useApiQuery';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export default function Page({ params }: Route.ComponentProps) {
  const [entitySchema] = useApiQuery(getEntitySchema, [params.name], {
    redirectOnNotFound: true,
  });

  const [entity] = useApiQuery(getEntityById, [params.name, params.id], {
    redirectOnNotFound: true,
  });

  return (
    <MultipleDataLoader
      className={styles.root}
      result={[entitySchema, entity] as const}
    >
      {([entitySchema, entity]) => (
        <AccessEntityView schema={entitySchema} initialValue={entity} />
      )}
    </MultipleDataLoader>
  );
}
