import {
  conditionalAstExpressionToString,
  parseConditionalNotation,
} from '@game-cms/conditional';
import { ComponentClientDataResolver } from '@game-cms/types';

export const clientResolver: ComponentClientDataResolver<'base::alternative'> =
  {
    toClient: (data) => ({
      default: data.default,
      alternative: data.alternative.map((item) => ({
        condition: conditionalAstExpressionToString(item.condition),
        value: item.value,
      })),
    }),
    fromClient: (data) => {
      const parsedConditions = data.alternative.map(({ condition }) => {
        try {
          return { value: parseConditionalNotation(condition) };
        } catch (error) {
          return {
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      });

      if (parsedConditions.some((item) => item.error !== undefined)) {
        return {
          error: {
            default: undefined,
            alternative: parsedConditions.map(({ error }) => ({
              data: undefined,
              condition: error,
            })),
          },
        };
      }

      return {
        result: {
          default: data.default,
          alternative: data.alternative.map((item, i) => ({
            value: item.value,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            condition: parsedConditions[i].value!,
          })),
        },
      };
    },
  };
