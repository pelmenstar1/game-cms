import { ComponentDefaultRenderer } from '@game-cms/core';
import { NumberInput } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import styles from './renderer.module.scss';
import { Id } from './types.js';

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  options,
  error,
  readOnly,
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
    <NumberInput
      className={styles.root}
      error={errorText}
      text={data}
      readOnly={readOnly}
      min={options.min}
      max={options.max}
      integer={options.integer}
      onTextChanged={onDataChanged}
    />
  );
};
