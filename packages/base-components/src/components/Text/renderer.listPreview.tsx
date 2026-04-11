import { ComponentListPreviewRenderer } from '@game-cms/base-core';
import { MiddleEllipsis } from '@game-cms/ui';

import { Id } from './types.js';

export const listPreview: ComponentListPreviewRenderer<Id> = ({ data }) => {
  return <MiddleEllipsis>{data}</MiddleEllipsis>;
};
