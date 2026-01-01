import type {
  EntityDataById,
  EntityId,
  EntitySchemaById,
} from '@game-cms/base-types';
import { useComponentApi } from '@game-cms/component-api';
import { mapObject } from '@game-cms/shared/object';
import type {
  ComponentClientDataById,
  ComponentOptionsById,
} from '@game-cms/types';
import {
  Button,
  classNames,
  DeleteIcon,
  IconButton,
  Typography,
} from '@game-cms/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useComponentHub } from '@/hooks/useComponentHub';
import { transformDataToClientData } from '@/services/entity/transform';

import styles from './AccessEntityView.module.scss';

export interface AccessEntityViewProps<Id extends EntityId> {
  className?: string;
  schema: EntitySchemaById<Id>;
  initialValue?: EntityDataById<Id>;
  onSave?: (value: EntityDataById<Id>) => void;
  onDelete?: () => void;
}

export function AccessEntityView<Id extends EntityId>({
  className,
  schema,
  initialValue,
  onSave,
  onDelete,
}: AccessEntityViewProps<Id>) {
  const api = useComponentApi();
  const hub = useComponentHub();

  const Compose = api.getComponent('base::compose');

  const composeOptions = useMemo(
    (): ComponentOptionsById<'base::compose'> =>
      mapObject(schema.components, (component) => ({
        componentId: component.componentId as string,
        options: component.options,
      })),
    [schema]
  );

  const [clientData, setClientData] =
    useState<ComponentClientDataById<'base::compose'>>();

  useEffect(() => {
    const worker = async () => {
      const result = await transformDataToClientData(
        api,
        schema,
        initialValue,
        composeOptions
      );

      setClientData(result);
    };

    void worker();
  }, [api, composeOptions, initialValue, schema]);

  const data = useMemo(
    () =>
      clientData
        ? api.clientResolverContext.fromClient(
            'base::compose',
            clientData,
            composeOptions
          )
        : undefined,
    [api, clientData, composeOptions]
  );

  const error = useMemo(
    () =>
      data?.result
        ? hub.validationContext.data(
            'base::compose',
            data.result,
            composeOptions
          )
        : data?.error,
    [data, hub.validationContext, composeOptions]
  );

  const onSaveTransformed = useCallback(() => {
    const dataValue = data?.result;

    if (dataValue !== undefined) {
      onSave?.(dataValue as EntityDataById<Id>);
    }
  }, [data, onSave]);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          {schema.title}
        </Typography>

        {initialValue !== undefined && (
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
          {clientData !== undefined && (
            <Compose
              data={clientData}
              options={composeOptions}
              error={error}
              onDataChanged={setClientData}
            />
          )}
        </div>

        <div className={styles['action-block']}>
          <Button
            buttonVariant="solid"
            onClick={onSaveTransformed}
            disabled={error !== undefined}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
