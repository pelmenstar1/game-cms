import { TextInput } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

export interface ConditionalInputProps {
  className?: string;
  value: string;
  error?: string;
  onValueChanged?: (value: string) => void;
}

export function ConditionalInput({
  onValueChanged,
  ...rest
}: ConditionalInputProps) {
  const { t } = useTranslation('base', {
    keyPrefix: 'micro.ConditionalInput',
  });

  return (
    <TextInput
      onTextChanged={onValueChanged}
      placeholder={t('placeholder')}
      {...rest}
    />
  );
}
