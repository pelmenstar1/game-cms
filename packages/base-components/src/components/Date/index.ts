import { ComponentSchema } from '@game-cms/core';
import {
  DateLike,
  isValidDate,
  resolveDateLike,
} from '@game-cms/shared/chrono';

import { Id, id } from './types.js';

function assetValidDate(date: Date | undefined, type: string) {
  if (date !== undefined && !isValidDate(date)) {
    throw new Error(`Invalid ${type} date (${date})`);
  }
}

function assetValidDateRange(
  minDate: Date | undefined,
  maxDate: Date | undefined
) {
  if (minDate !== undefined && maxDate !== undefined && minDate > maxDate) {
    throw new Error(
      `Invalid date range: minDate (${minDate}) is later than maxDate (${maxDate})`
    );
  }
}

export function date(options?: {
  minDate?: DateLike;
  maxDate?: DateLike;
}): ComponentSchema<Id> {
  const minDate = resolveDateLike(options?.minDate);
  const maxDate = resolveDateLike(options?.maxDate);

  assetValidDate(minDate, 'min');
  assetValidDate(maxDate, 'max');
  assetValidDateRange(minDate, maxDate);

  return {
    componentId: id,
    options: { minDate, maxDate },
  };
}
