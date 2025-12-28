import { useComponentApi } from '@game-cms/component-api';
import type {
  ComponentDataById,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/types';
import {
  classNames,
  DeleteIcon,
  DragHandle,
  IconButton,
  Typography,
} from '@game-cms/ui';
import type { RefObject } from 'react';

import { ConditionalInput } from '../ConditionalInput/index.js';
import styles from './EntityComponentChoice.module.scss';

export interface EntityComponentChoiceProps<Id extends ComponentId> {
  className?: string;
  handleRef?: RefObject<HTMLButtonElement | null>;

  componentId: Id;
  options: ComponentOptionsById<Id>;
  data: ComponentDataById<Id>;
  dataError: ComponentErrorById<Id> | undefined;
  condition: string;
  conditionError: string | undefined;

  onConditionChanged?: (value: string) => void;
  onDataChanged?: (data: ComponentDataById<Id>) => void;
  onDelete?: () => void;
}

export function EntityComponentChoice<Id extends ComponentId>({
  className,
  handleRef,
  componentId,
  options,
  condition,
  data,
  conditionError,
  dataError,
  onDataChanged,
  onConditionChanged,
  onDelete,
}: EntityComponentChoiceProps<Id>) {
  const api = useComponentApi();
  const Component = api.getComponent(componentId);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.header}>
        <Typography className={styles['alternative-label']}>
          Alternative
        </Typography>

        <IconButton
          title="Delete alternative"
          className={styles['delete-button']}
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>

        <DragHandle className={styles['drag-handle']} ref={handleRef} />
      </div>

      <ConditionalInput
        value={condition}
        error={conditionError}
        onValueChanged={onConditionChanged}
      />

      <Component
        data={data}
        options={options}
        error={dataError}
        onDataChanged={(value) => {
          onDataChanged?.(value);
        }}
      />
    </div>
  );
}
