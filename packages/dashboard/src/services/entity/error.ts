import type {
  RawConditionalChoices,
  RawEntityConditionalData,
} from '@/types/conditional';

export const ComponentErrorPending = Symbol();

export function resolveComponentError(error: unknown) {
  return error !== ComponentErrorPending ? error : undefined;
}

export function entityDataHasErrors(data: RawEntityConditionalData) {
  return Object.values<RawConditionalChoices>(data).some(
    (value) =>
      value.default.error !== undefined ||
      value.alternative.some(
        ({ condition, data }) =>
          condition.error !== undefined || data.error !== undefined
      )
  );
}
