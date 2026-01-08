import { ComponentRenderer } from '@game-cms/core';
import { TextInput } from '@game-cms/ui';

export const renderer: ComponentRenderer<'base::number'> = ({
  data,
  options,
  error,
  onDataChanged,
}) => {
  const errorText =
    error === 'TOO_SMALL'
      ? `Min. ${options.min}`
      : error === 'TOO_LARGE'
        ? `Max. ${options.max}`
        : error === 'EXPECTED_INTEGER'
          ? 'Expected integer'
          : error === 'NAN'
            ? 'Invalid format'
            : undefined;

  return (
    <TextInput error={errorText} value={data} onTextChanged={onDataChanged} />
  );
};
