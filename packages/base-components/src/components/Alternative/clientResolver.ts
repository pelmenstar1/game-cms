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
    toClient: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return {
        default: context.toClient(componentId, data.default, baseOptions),
        alternative: data.alternative.map((item) => ({
          condition: conditionalAstExpressionToString(item.condition),
          value: context.toClient(componentId, item.value, baseOptions),
        })),
      };
    },
    fromClient: (data, options, context) => {
      const { componentId, baseOptions } = options;
      const defaultResult = context.fromClient(
        componentId,
        data.default,
        baseOptions
      );

      const alternativeResult = data.alternative.map(
        ({ value, condition: rawCondition }) => {
          const condition = parseCondition(rawCondition);
          const data = context.fromClient(componentId, value, baseOptions);

          if (condition.error !== undefined || data.error !== undefined) {
            return { error: { condition: condition.error, data: data.error } };
          }

          return { value: { condition: condition.value, data: data.result } };
        }
      );

      if (
        defaultResult.error !== undefined ||
        alternativeResult.some((item) => item.error !== undefined)
      ) {
        return {
          error: {
            default: defaultResult.error,
            alternative: alternativeResult.map(({ error }) => ({
              data: error?.data,
              condition: error?.condition,
            })),
          },
        };
      }

      return {
        result: {
          default: defaultResult.result,
          alternative: alternativeResult.map(({ value }) => {
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
