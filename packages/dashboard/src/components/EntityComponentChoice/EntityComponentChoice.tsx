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
import type { RefObject, SetStateAction } from 'react';

import type { RawConditionalAlternativeChoice } from '@/types/conditional';

import { ConditionalInput } from '../ConditionalInput';
import { RemoteComponentWithErrorReporting } from '../RemoteComponentWithErrorReporting';
import styles from './EntityComponentChoice.module.scss';

type RawConditionalAlternativeChoiceById<Id extends ComponentId> =
  RawConditionalAlternativeChoice<
    ComponentDataById<Id>,
    ComponentErrorById<Id>
  >;

export interface EntityComponentChoiceProps<Id extends ComponentId> {
  className?: string;
  handleRef?: RefObject<HTMLButtonElement | null>;
  componentId: Id;
  options: ComponentOptionsById<Id>;
  choice: RawConditionalAlternativeChoiceById<Id>;
  onChoiceChanged?: (
    value: SetStateAction<RawConditionalAlternativeChoiceById<Id>>
  ) => void;
  onDelete?: () => void;
}

export function EntityComponentChoice<Id extends ComponentId>({
  className,
  handleRef,
  componentId,
  options,
  choice: { condition, data },
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
        value={condition.raw}
        error={condition.error}
        onValueChanged={(raw, expression, error) => {
          onChoiceChanged?.((choice) => ({
            condition: { raw, expression, error },
            data: choice.data,
          }));
        }}
      />
      <RemoteComponentWithErrorReporting
        componentId={componentId}
        data={data.value}
        options={options}
        error={data.error}
        onDataChanged={(value, error) => {
          onChoiceChanged?.((choice) => ({
            condition: choice.condition,
            data: { value, error },
          }));
        }}
      />
    </div>
  );
}
