import { useComponentApi } from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/types';
import { classNames, Typography } from '@game-cms/ui';
import type { RefObject } from 'react';

import { ConditionalInput } from '../ConditionalInput/index.js';
import { ItemControlHeader } from '../ItemControlHeader/index.js';
import styles from './EntityComponentChoice.module.scss';

export interface EntityComponentChoiceProps<Id extends ComponentId> {
  className?: string;
  handleRef?: RefObject<HTMLButtonElement | null>;

  componentId: Id;
  options: ComponentOptionsById<Id>;
  data: ComponentClientDataById<Id>;
  dataError: ComponentErrorById<Id> | undefined;
  condition: string;
  conditionError: string | undefined;

  onConditionChanged?: (value: string) => void;
  onDataChanged?: (data: ComponentClientDataById<Id>) => void;
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
      <ItemControlHeader
        className={styles.header}
        onDelete={onDelete}
        handleRef={handleRef}
      >
        <Typography className={styles['alternative-label']}>
          Alternative
        </Typography>
      </ItemControlHeader>

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
