import { isValidConditionalNotation } from '@game-cms/conditional';
import { TextInput } from '@game-cms/ui';
import { useMemo } from 'react';

export interface ConditionalInputProps {
  className?: string;
  value: string;
  onValueChanged: (value: string) => void;
}

export function ConditionalInput({
  className,
  value,
  onValueChanged,
}: ConditionalInputProps) {
  const isValid = useMemo(() => isValidConditionalNotation(value), [value]);

  return (
    <TextInput
      className={className}
      value={value}
      onTextChanged={onValueChanged}
      error={!isValid}
    />
  );
}
