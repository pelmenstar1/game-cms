import preview from '#storybook/preview';

import { Typography } from '.';

const meta = preview.meta({
  component: Typography,
  args: { children: 'Some text' },
});

export const Body = meta.story({ args: { variant: 'body' } });
export const BodyLarge = meta.story({ args: { variant: 'bodyLarge' } });
export const H1 = meta.story({ args: { variant: 'h1' } });
export const H2 = meta.story({ args: { variant: 'h2' } });
export const H3 = meta.story({ args: { variant: 'h3' } });
export const H4 = meta.story({ args: { variant: 'h4' } });
export const H5 = meta.story({ args: { variant: 'h5' } });
export const H6 = meta.story({ args: { variant: 'h6' } });
