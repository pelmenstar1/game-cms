import { ComponentErrorById, ComponentOptionsById } from '@game-cms/core';

import { Id } from './types.js';

export function isValidData(
  value: unknown,
  width: number,
  height: number
): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === width * height &&
    value.every((item) => Number.isSafeInteger(item) && item >= 0)
  );
}

function isValidShape(
  value: unknown,
  options: ComponentOptionsById<Id>
): value is number[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return isValidData(value, options.width, options.height);
}

export function validator(
  data: unknown,
  options: ComponentOptionsById<Id>
): ComponentErrorById<Id> | undefined {
  if (!isValidShape(data, options)) {
    return 'INVALID_TYPE';
  }
}

export function getDefaultData({ width, height }: ComponentOptionsById<Id>) {
  return Array.from({ length: width * height }, () => 0);
}
