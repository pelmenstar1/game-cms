import type { ComposeOptions } from '@game-cms/base-components';
import type { ClientEntitySchema, EntityData } from '@game-cms/base-types';
import { useComponentApi } from '@game-cms/component-api';
import { mapObject } from '@game-cms/shared/object';
import {
  Button,
  classNames,
  DeleteIcon,
  IconButton,
  Typography,
} from '@game-cms/ui';
import { useCallback, useMemo, useState } from 'react';

import { useComponentHub } from '@/hooks/useComponentHub';
import { transformEntityConditionalDataToRaw } from '@/services/entity/transform';

import styles from './AccessEntityView.module.scss';

export interface AccessEntityViewProps<T extends EntityData> {
  className?: string;
  schema: ClientEntitySchema<T>;
  initialValue?: T;
  onSave?: (value: T) => void;
  onDelete?: () => void;
}

export function AccessEntityView<T extends EntityData>({
  className,
  schema,
  initialValue,
  onSave,
  onDelete,
}: AccessEntityViewProps<T>) {
  const api = useComponentApi();
  const hub = useComponentHub();

  const Compose = api.getComponent('base::compose');

  const composeOptions = useMemo(
    (): ComposeOptions =>
      mapObject(schema.components, (component) => ({
        componentId: component.controller as string,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        options: component.options,
      })),
    [schema]
  );

  const [currentValue, setCurrentValue] = useState(() =>
    transformEntityConditionalDataToRaw(
      api,
      schema,
      initialValue,
      composeOptions
    )
  );

  const error = useMemo(
    () =>
      hub.validationContext.data('base::compose', currentValue, composeOptions),
    [composeOptions, currentValue, hub]
  );

  const onSaveTransformed = useCallback(() => {
    // onSave?.(transformEntityConditionalDataFromRaw(currentValue));
  }, [currentValue, onSave]);

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
          <Compose
            data={currentValue}
            options={composeOptions}
            error={error}
            onDataChanged={setCurrentValue}
          />
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
