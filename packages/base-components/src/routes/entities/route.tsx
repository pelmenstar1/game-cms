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

import { useEntitySchemaContext } from '../../hooks/useEntitySchemaContext.js';
import { useSelfSession } from '../../hooks/useSelfSession.js';
import { EntityListLoader } from '../../micro/Entity/EntityListLoader/index.js';
import { EntitySearchDialog } from '../../micro/Entity/EntitySearchDialog/index.js';
import styles from './route.module.scss';

export function meta() {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Page({
  params,
}: {
  params: { name: string | undefined };
}) {
  const { name: selectedEntity } = params;

  const { entityIds, getEntityTitle } = useEntitySchemaContext();

  const { permissions } = useSelfSession();
  const navigate = useTypedNavigate();

  const showModal = useModal();

  useEffect(() => {
    if (selectedEntity === undefined && entityIds.length > 0) {
      const [id] = entityIds;

      void navigate(`/entities/${id}`);
    }
  }, [navigate, selectedEntity, entityIds]);

  useEffect(() => {
    if (selectedEntity && !entityIds.includes(selectedEntity)) {
      void navigate('/404');
    }
  }, [navigate, selectedEntity, entityIds]);

  const onShowSearch = useCallback(() => {
    if (selectedEntity) {
      void showModal(
        EntitySearchDialog,
        { entityId: selectedEntity },
        { singleInstance: true }
      );
    }
  }, [selectedEntity, showModal]);

  useHotkey({ combination: ['Control', 'f'], callback: onShowSearch });

  return (
    <div className={styles.root}>
      <NavTabs
        className={styles['entities-tabs']}
        items={entityIds
          .filter((id) => permissions.has(`entity/${id}$get`))
          .map((id) => ({
            text: getEntityTitle(id),
            href: `/entities/${id}`,
          }))}
      />

      {selectedEntity && (
        <div className={styles.content}>
          <Toolbar className={styles['toolbar']}>
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
