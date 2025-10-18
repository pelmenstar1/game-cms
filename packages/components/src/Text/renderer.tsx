import { ComponentRenderer } from '@game-cms/types';
import { Typography } from '@game-cms/ui';

export const renderer: ComponentRenderer<'base::text'> = ({ data, options }) => {
  return <Typography />;
};
