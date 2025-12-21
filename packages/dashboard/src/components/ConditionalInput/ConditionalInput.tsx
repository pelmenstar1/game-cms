import {
  type ConditionalAstExpression,
  inferExpressionOutput,
  parseConditionalNotation,
} from '@game-cms/conditional';
import { TextInput } from '@game-cms/ui';
import { useCallback } from 'react';

export interface ConditionalInputProps {
  className?: string;
  value: string;
  error?: string;
  onValueChanged: (
    raw: string,
    expression: ConditionalAstExpression | null,
    error: string | undefined
  ) => void;
}

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

export function ConditionalInput({
  onValueChanged,
  ...rest
}: ConditionalInputProps) {
  const onTextChanged = useCallback(
    (raw: string) => {
      const { expression, error } = parseNotationWithError(raw);

      onValueChanged(raw, expression, error);
    },
    [onValueChanged]
  );

  return <TextInput onTextChanged={onTextChanged} {...rest} />;
}
