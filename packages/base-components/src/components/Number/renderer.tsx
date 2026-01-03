import { ComponentRenderer } from '@game-cms/core';
import { Typography } from '@game-cms/ui';

export const renderer: ComponentRenderer<'base::number'> = () => {
  return <Typography />;
};
