import type {
  EntityId,
  EntityMap,
  EntityRawDataById,
  EntityRawInDataById,
  EntitySchemaById,
} from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import type { ComponentClientDataById } from '@game-cms/core';
import {
  Button,
  classNames,
  DeleteIcon,
  IconButton,
  Typography,
} from '@game-cms/ui';
import { useCallback, useMemo, useState } from 'react';

import { useSelfPermissions } from '@/hooks/useSelfPermissions';
import {
  type EntityComposeOptions,
  transformDataToClientData,
} from '@/services/entity/transform';

import styles from './AccessEntityView.module.scss';

const composeId = 'base::compose';

type ComposeId = typeof composeId;

export interface AccessEntityViewProps<Id extends EntityId> {
  className?: string;
  schema: EntitySchemaById<Id>;
  initialValue?: EntityRawDataById<Id>;
  onSave?: (value: EntityRawInDataById<Id>) => void;
  onDelete?: () => void;
}

export function AccessEntityView<Id extends EntityId>({
  className,
  schema,
  initialValue,
  onSave,
  onDelete,
}: AccessEntityViewProps<Id>) {
  type Args = EntityMap[Id];
  type ClientData = ComponentClientDataById<ComposeId, Args>;

  const api = useComponentApi();
  const permissions = useSelfPermissions();

  const Compose = api.getComponent(composeId);
  const composeOptions = schema.components as EntityComposeOptions<Id>;

  const [clientData, setClientData] = useState<ClientData>(() =>
    transformDataToClientData(api, initialValue, composeOptions)
  );

  const data = useMemo(() => {
    return api.clientTransformerContext.fromClient<ComposeId, Args>(
      composeId,
      clientData,
      composeOptions
    );
  }, [api, clientData, composeOptions]);

  const onSaveTransformed = useCallback(() => {
    const rawData = data.result;

    if (rawData !== undefined) {
      onSave?.(rawData);
    }
  }, [data, onSave]);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          {schema.title}
        </Typography>

        {initialValue !== undefined &&
          permissions.has(`entity/${schema.id}$delete`) && (
            <IconButton
              className={styles.delete}
              title="Delete"
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>
          )}
      </div>

      <div className={styles.content}>
        <div className={styles['component-grid']}>
          <Compose
            data={clientData}
            options={composeOptions}
            error={data.error}
            onDataChanged={setClientData}
          />
        </div>

        <div className={styles['action-block']}>
          <Button
            buttonVariant="solid"
            onClick={onSaveTransformed}
            disabled={data.error !== undefined}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
