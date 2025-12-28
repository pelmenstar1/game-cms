import { TextInput } from '@game-cms/ui';

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
  return <TextInput onTextChanged={onValueChanged} {...rest} />;
}
