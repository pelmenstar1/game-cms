import type { ClientEntitySchema, EntityData } from '@game-cms/base-types';
import type { EntityConditionalData } from '@game-cms/conditional';
import {
  Button,
  classNames,
  DeleteIcon,
  IconButton,
  Typography,
} from '@game-cms/ui';
import { useCallback, useMemo, useState } from 'react';

import { entityDataHasErrors } from '@/services/entity/error';
import {
  transformEntityConditionalDataFromRaw,
  transformEntityConditionalDataToRaw,
} from '@/services/entity/transform';

import { EntityComponentGrid } from '../EntityComponentGrid';
import styles from './AccessEntityView.module.scss';

export interface AccessEntityViewProps<T extends EntityData> {
  className?: string;
  schema: ClientEntitySchema<T>;
  initialValue?: EntityConditionalData<T>;
  onSave?: (value: EntityConditionalData<T>) => void;
  onDelete?: () => void;
}

export function AccessEntityView<T extends EntityData>({
  className,
  schema,
  initialValue,
  onSave,
  onDelete,
}: AccessEntityViewProps<T>) {
  const [currentValue, setCurrentValue] = useState(() =>
    transformEntityConditionalDataToRaw(schema, initialValue)
  );

  const hasErrors = useMemo(
    () => entityDataHasErrors(currentValue),
    [currentValue]
  );

  const onSaveTransformed = useCallback(() => {
    onSave?.(transformEntityConditionalDataFromRaw(currentValue));
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
        <EntityComponentGrid
          className={styles['component-grid']}
          schema={schema}
          value={currentValue}
          onValueChanged={setCurrentValue}
        />

        <div className={styles['action-block']}>
          <Button
            buttonVariant="solid"
            onClick={onSaveTransformed}
            disabled={hasErrors}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
