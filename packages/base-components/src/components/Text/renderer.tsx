import { ComponentRenderer } from '@game-cms/core';
import { TextInput } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import styles from './renderer.module.scss';

export const renderer: ComponentRenderer<'base::text'> = ({
  data,
  error,
  onDataChanged,
}) => {
  const { t } = useTranslation('base');

  const errorMessage = error ? t(`components.Text.errors.${error}`) : undefined;

  return (
    <TextInput
      className={styles.root}
      value={data}
      error={errorMessage}
      onTextChanged={onDataChanged}
    />
  );
};
