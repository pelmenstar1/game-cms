import { ComponentListPreviewRenderer } from '@game-cms/base-core';
import { Typography } from '@game-cms/ui';

import { Id } from './types.js';

export const listPreview: ComponentListPreviewRenderer<Id> = ({ data }) => {
  return <Typography>{data}</Typography>;
};
