import { ComponentDefaultRenderer } from '@game-cms/core';
import { TextInput } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import styles from './renderer.module.scss';
import { Id } from './types.js';

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  options,
  error,
  readonly,
  onDataChanged,
}) => {
  const { t } = useTranslation('base', {
    keyPrefix: 'components.Number',
  });

  const errorText = error
    ? t(`errors.${error}`, {
        min: options.min,
        max: options.max,
      })
    : undefined;

  return (
    <TextInput
      className={styles.root}
      error={errorText}
      value={data}
      readOnly={readonly}
      onTextChanged={onDataChanged}
    />
  );
};
