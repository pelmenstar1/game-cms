import { ComponentDefaultRenderer } from '@game-cms/core';
import { JsonEditor } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

export const renderer: ComponentDefaultRenderer<'base::json'> = ({
  data,
  options,
  error,
  onDataChanged,
}) => {
  const { t } = useTranslation('base', {
    keyPrefix: 'components.Json',
  });

  return (
    <JsonEditor
      text={data}
      customError={error ? t(`errors.${error}`) : undefined}
      allowEmpty={options.allowEmpty}
      onTextChanged={onDataChanged}
    />
  );
};
