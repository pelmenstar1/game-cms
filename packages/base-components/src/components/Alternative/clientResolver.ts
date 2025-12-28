import {
  conditionalAstExpressionToString,
  parseConditionalNotation,
} from '@game-cms/conditional';
import { ComponentClientDataResolver } from '@game-cms/types';

function parseCondition(text: string) {
  try {
    return { value: parseConditionalNotation(text) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export const clientResolver: ComponentClientDataResolver<'base::alternative'> =
  {
    toClient: (data, options, context) => ({
      default: data.default,
      alternative: data.alternative.map((item) => ({
        condition: conditionalAstExpressionToString(item.condition),
        value: context.toClient(
          options.componentId,
          item.value,
          options.baseOptions
        ),
      })),
    }),
    fromClient: (data, options, context) => {
      const result = data.alternative.map(
        ({ value, condition: rawCondition }) => {
          const condition = parseCondition(rawCondition);

          const data = context.fromClient(
            options.componentId,
            value,
            options.baseOptions
          );

          if (condition.error !== undefined || data.error !== undefined) {
            return { error: { condition: condition.error, data: data.error } };
          }

          return { value: { condition: condition.value, data: data.result } };
        }
      );

      if (result.some((item) => item.error !== undefined)) {
        return {
          error: {
            default: undefined,
            alternative: result.map(({ error }) => ({
              data: error?.data,
              condition: error?.condition,
            })),
          },
        };
      }

      return {
        result: {
          default: data.default,
          alternative: result.map(({ value }) => {
            if (value === undefined) {
              throw new Error('Value is undefined');
            }

            return {
              condition: value.condition,
              value: value.data,
            };
          }),
        },
      };
    },
  };
