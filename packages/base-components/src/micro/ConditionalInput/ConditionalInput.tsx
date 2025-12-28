import { TextInput } from '@game-cms/ui';

export interface ConditionalInputProps {
  className?: string;
  value: string;
  error?: string;
  onValueChanged?: (value: string) => void;
}

/*
function parseNotationWithError(text: string) {
  try {
    const expression = parseConditionalNotation(text);

    if (inferExpressionOutput(expression) !== 'boolean') {
      return {
        expression: null,
        error: 'Expression should output logical value',
      };
    }

    return { expression };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { expression: null, error: message };
  }
}
  */

export function ConditionalInput({
  onValueChanged,
  ...rest
}: ConditionalInputProps) {
  return <TextInput onTextChanged={onValueChanged} {...rest} />;
}
