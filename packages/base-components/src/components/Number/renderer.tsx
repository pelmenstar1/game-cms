import { ComponentRenderer } from '@game-cms/core';
import { TextInput } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

export const renderer: ComponentRenderer<'base::number'> = ({
  data,
  options,
  error,
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
    <TextInput error={errorText} value={data} onTextChanged={onDataChanged} />
  );
};
