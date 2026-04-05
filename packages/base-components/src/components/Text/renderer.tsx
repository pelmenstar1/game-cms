import { ComponentDefaultRenderer } from '@game-cms/core';
import { TextInput } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import styles from './renderer.module.scss';
import { Id } from './types.js';

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  error,
  readonly,
  onDataChanged,
}) => {
  const { t } = useTranslation('base');

  const errorMessage = error ? t(`components.Text.errors.${error}`) : undefined;

  return (
    <TextInput
      className={styles.root}
      value={data}
      error={errorMessage}
      readOnly={readonly}
      onTextChanged={onDataChanged}
    />
  );
};
