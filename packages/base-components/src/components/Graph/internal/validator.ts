import { mapObject } from '@game-cms/shared/object';

import { dataShape } from './schema.js';

export function validator(
  rawData: unknown,
  validate: (nodeValue: unknown) => unknown
) {
  const parseResult = dataShape.safeParse(rawData);
  if (!parseResult.success) {
    return { ownError: 'INVALID_TYPE' as const };
  }

  const { data } = parseResult;

  return mapObject(data.nodes, ({ value }) => validate(value));
}
