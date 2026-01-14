import { useComponentApi } from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/core';
import { classNames, Typography } from '@game-cms/ui';
import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

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
  readonly?: boolean;

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
  readonly,
  onDataChanged,
  onConditionChanged,
  onDelete,
}: EntityComponentChoiceProps<Id>) {
  const api = useComponentApi();
  const Component = api.getComponent(componentId);

  const { t } = useTranslation('base', {
    keyPrefix: 'micro.EntityComponentChoice',
  });

  return (
    <div className={classNames(styles.root, className)}>
      <ItemControlHeader
        className={styles.header}
        onDelete={onDelete}
        handleRef={handleRef}
        readonly={readonly}
      >
        <Typography className={styles['alternative-label']}>
          {t('alternative')}
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
        readonly={readonly}
        onDataChanged={onDataChanged}
      />
    </div>
  );
}
