import { LinkButton, NavTabs, PlusIcon, useTypedNavigate } from '@game-cms/ui';
import { useEffect } from 'react';

import { EntityList } from '@/components/EntityList';
import { getEntityMetaMap } from '@/connector/entity';

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
  const schemas = getEntityMetaMap();

  const selectedSchema = selectedEntity ? schemas[selectedEntity] : null;

  const navigate = useTypedNavigate();

  useEffect(() => {
    const schemasArray = Object.entries(schemas);

    if (schemasArray.length > 0 && selectedEntity === undefined) {
      const [[id]] = schemasArray;

      void navigate(`/entities/${id}`);
    }
  }, [navigate, schemas, selectedEntity]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (selectedSchema === undefined) {
      void navigate('/404');
    }
  }, [navigate, selectedSchema]);

  return (
    <div className={styles.root}>
      <NavTabs
        className={styles['entities-tabs']}
        items={Object.entries(schemas).map(([id, { title }]) => ({
          text: title,
          href: `/entities/${id}`,
        }))}
      />

      {selectedEntity && selectedSchema && (
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
            entityId={selectedEntity}
            className={styles['entity-list']}
          />
        </div>
      )}
    </div>
  );
}
