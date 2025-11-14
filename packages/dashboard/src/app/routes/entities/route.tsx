import { getEntitySchemas } from '@game-cms/client';
import { NavTabs } from '@game-cms/ui';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useApiQuery } from '@/hooks/useApiQuery';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export function meta() {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home({ params }: Route.ComponentProps) {
  const { name: selectedEntity } = params;
  const [schemasResult] = useApiQuery(getEntitySchemas);
  const schemas =
    schemasResult.status === 'success' ? schemasResult.value : undefined;

  const navigate = useNavigate();

  useEffect(() => {
    if (schemas && schemas.length > 0 && selectedEntity === undefined) {
      const [schema] = schemas;

      void navigate(`/entities/${schema.id}`);
    }
  }, [navigate, schemas, selectedEntity]);

  return (
    <div className={styles.root}>
      <NavTabs
        className={styles['entities-tabs']}
        items={
          schemas?.map((schema) => ({
            text: schema.title,
            href: `/entities/${schema.id}`,
          })) ?? []
        }
      />

      {}
    </div>
  );
}
