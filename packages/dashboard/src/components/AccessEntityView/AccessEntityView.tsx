import type { ClientEntitySchema, EntityData } from '@game-cms/base-types';
import {
  conditionalAstExpressionToString,
  type EntityConditionalData,
} from '@game-cms/conditional';
import { mapObject } from '@game-cms/shared/object';
import {
  Button,
  classNames,
  DeleteIcon,
  IconButton,
  Typography,
} from '@game-cms/ui';
import { useMemo, useState } from 'react';

import { entityDataHasErrors } from '@/services/entity/error';
import type { RawEntityConditionalData } from '@/types/conditional';

import { EntityComponentGrid } from '../EntityComponentGrid';
import styles from './AccessEntityView.module.scss';

export interface AccessEntityViewProps<T extends EntityData> {
  className?: string;
  schema: ClientEntitySchema<T>;
  initialValue?: EntityConditionalData<T>;
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
  const [currentValue, setCurrentValue] = useState(() => {
    if (initialValue) {
      return mapObject(initialValue, (value) => ({
        default: { value: value.default },
        alternative: value.alternative?.map((choice) => ({
          condition: conditionalAstExpressionToString(choice.condition),
          value: choice.value,
        })),
      })) as RawEntityConditionalData<T>;
    }
  });

  const hasErrors = useMemo(
    () => currentValue !== undefined && entityDataHasErrors(currentValue),
    [currentValue]
  );

  console.log('hasErrors', hasErrors);

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
          <Button buttonVariant="solid" onClick={onSave} disabled={hasErrors}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
