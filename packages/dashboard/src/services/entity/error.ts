import type {
  RawConditionalChoices,
  RawEntityConditionalData,
} from '@/types/conditional';

export function entityDataHasErrors(data: RawEntityConditionalData) {
  return Object.values<RawConditionalChoices>(data).some(
    (value) =>
      value.default.error !== undefined ||
      value.alternative.some((choice) => choice.error !== undefined)
  );
}
