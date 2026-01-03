import { ComponentRenderer } from '@game-cms/core';
import { TextInput } from '@game-cms/ui';

import styles from './client.module.scss';

export const renderer: ComponentRenderer<'base::text'> = ({
  data,
  error,
  onDataChanged,
}) => {
  const errorMessage =
    error === 'TEXT_TOO_LONG'
      ? 'Text is too long'
      : error === 'TEXT_TOO_SHORT'
        ? 'Text is too short'
        : undefined;

  return (
    <TextInput
      className={styles.root}
      value={data}
      error={errorMessage}
      onTextChanged={onDataChanged}
    />
  );
};
