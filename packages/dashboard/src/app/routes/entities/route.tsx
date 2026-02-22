import {
  IconButton,
  LinkButton,
  NavTabs,
  PlusIcon,
  SearchIcon,
  Toolbar,
  useHotkey,
  useModal,
  useTypedNavigate,
} from '@game-cms/ui';
import { useCallback, useEffect } from 'react';

import { EntityListLoader } from '@/components/EntityListLoader';
import { EntitySearchDialog } from '@/components/EntitySearchDialog';
import { getEntityIds, getEntityTitle } from '@/connector/entity';
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

  const { permissions } = useSelfSession();
  const navigate = useTypedNavigate();

  const showModal = useModal();

  useEffect(() => {
    const schemasArray = getEntityIds();

    if (schemasArray.length > 0 && selectedEntity === undefined) {
      const [id] = schemasArray;

      void navigate(`/entities/${id}`);
    }
  }, [navigate, selectedEntity]);

  useEffect(() => {
    if (!selectedEntity || !getEntityIds().includes(selectedEntity)) {
      void navigate('/404');
    }
  }, [navigate, selectedEntity]);

  const onShowSearch = useCallback(() => {
    if (selectedEntity) {
      void showModal(
        EntitySearchDialog,
        { entityId: selectedEntity },
        { singleInstance: true }
      );
    }
  }, [selectedEntity, showModal]);

  useHotkey(['Control', 'f'], onShowSearch);

  return (
    <div className={styles.root}>
      <NavTabs
        className={styles['entities-tabs']}
        items={getEntityIds()
          .filter((id) => permissions.has(`entity/${id}$get`))
          .map((id) => ({
            text: getEntityTitle(id),
            href: `/entities/${id}`,
          }))}
      />

      {selectedEntity && (
        <div className={styles.content}>
          <Toolbar>
            <IconButton
              className={styles['search-button']}
              title="Search"
              onClick={onShowSearch}
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
