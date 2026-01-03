import { LinkButton, NavTabs, PlusIcon, useTypedNavigate } from '@game-cms/ui';
import { useEffect } from 'react';
import { getEntitySchemas } from 'virtual:dashboard/entityConnector';

import { EntityList } from '@/components/EntityList';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export function meta() {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Page({ params }: Route.ComponentProps) {
  const { name: selectedEntity } = params;
  const schemas = getEntitySchemas();

  const selectedSchema = selectedEntity
    ? schemas.find(({ id }) => id === selectedEntity)
    : null;

  const navigate = useTypedNavigate();

  useEffect(() => {
    if (schemas.length > 0 && selectedEntity === undefined) {
      const [schema] = schemas;

      void navigate(`/entities/${schema.id}`);
    }
  }, [navigate, schemas, selectedEntity]);

  useEffect(() => {
    if (selectedSchema === undefined) {
      void navigate('/404');
    }
  }, [navigate, selectedSchema]);

  return (
    <div className={styles.root}>
      <NavTabs
        className={styles['entities-tabs']}
        items={schemas.map((schema) => ({
          text: schema.title,
          href: `/entities/${schema.id}`,
        }))}
      />

      {selectedSchema && (
        <div className={styles.content}>
          <div className={styles.header}>
            <LinkButton
              className={styles['new-entity-button']}
              to={`/entities/${selectedEntity}/+`}
              buttonVariant="outlined"
            >
              <PlusIcon />
              New entity
            </LinkButton>
          </div>

          <EntityList
            schema={selectedSchema}
            className={styles['entity-list']}
          />
        </div>
      )}
    </div>
  );
}
