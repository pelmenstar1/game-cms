import { type RawConditionalAlternativeChoice } from '@game-cms/conditional';
import type {
  ComponentDataById,
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

import { ConditionalInput } from '../ConditionalInput';
import { RemoteComponent } from '../RemoteComponent';
import styles from './EntityComponentChoice.module.scss';

export interface EntityComponentChoiceProps<Id extends ComponentId> {
  className?: string;
  handleRef?: RefObject<HTMLButtonElement | null>;
  componentId: Id;
  options: ComponentOptionsById<Id>;
  choice: RawConditionalAlternativeChoice<ComponentDataById<Id>>;
  onChoiceChanged?: (
    value: RawConditionalAlternativeChoice<ComponentDataById<Id>>
  ) => void;
  onDelete?: () => void;
}

export function EntityComponentChoice<Id extends ComponentId>({
  className,
  handleRef,
  componentId,
  options,
  choice: { condition, value },
  onChoiceChanged,
  onDelete,
}: EntityComponentChoiceProps<Id>) {
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
        onValueChanged={(newCondition) => {
          onChoiceChanged?.({ condition: newCondition, value });
        }}
      />
      <RemoteComponent
        componentId={componentId}
        data={value}
        options={options}
        onDataChanged={(newData) => {
          onChoiceChanged?.({ condition, value: newData });
        }}
      />
    </div>
  );
}
