import {
  IconButton,
  LinkButton,
  NavTabs,
  PlusIcon,
  SearchIcon,
  Toolbar,
  useModal,
  useTypedNavigate,
} from '@game-cms/ui';
import { useCallback, useEffect } from 'react';

import { EntityListLoader } from '@/components/EntityListLoader';
import { EntitySearchDialog } from '@/components/EntitySearchDialog';
import { getEntityMetaMap } from '@/connector/entity';
import { useSelfSession } from '@/hooks/useSession';

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

  const { permissions } = useSelfSession();
  const navigate = useTypedNavigate();

  const showModal = useModal();

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

  const onSearchClick = useCallback(() => {
    if (selectedEntity) {
      void showModal(EntitySearchDialog, { entityId: selectedEntity });
    }
  }, [selectedEntity, showModal]);

  return (
    <div className={styles.root}>
      <NavTabs
        className={styles['entities-tabs']}
        items={Object.entries(schemas)
          .filter(([id]) => permissions.has(`entity/${id}$get`))
          .map(([id, { title }]) => ({
            text: title,
            href: `/entities/${id}`,
          }))}
      />

      {selectedEntity && selectedSchema && (
        <div className={styles.content}>
          <Toolbar>
            <IconButton
              className={styles['search-button']}
              title="Search"
              onClick={onSearchClick}
            >
              <SearchIcon />
            </IconButton>

            {permissions.has(`entity/${selectedEntity}$create`) && (
              <LinkButton
                className={styles['new-entity-button']}
                to={`/entities/${selectedEntity}/+`}
                buttonVariant="outlined"
              >
                <PlusIcon />
                New entity
              </LinkButton>
            )}
          </Toolbar>

          <EntityListLoader
            entityId={selectedEntity}
            className={styles['entity-list']}
          />
        </div>
      )}
    </div>
  );
}
