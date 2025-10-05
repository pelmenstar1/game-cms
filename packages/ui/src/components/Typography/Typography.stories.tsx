import type { Meta, StoryObj } from '@storybook/react';

import { Typography, TypographyVariant } from '.';

export default {
  component: Typography,
} satisfies Meta<typeof Typography>;

type Story = StoryObj<typeof Typography>;

function story(variant: TypographyVariant): Story {
  return {
    args: {
      variant,
      children: 'Some text',
    },
  };
}

export const Body = story('body');
export const BodyLarge = story('bodyLarge');
export const H1 = story('h1');
export const H2 = story('h2');
export const H3 = story('h3');
export const H4 = story('h4');
export const H5 = story('h5');
export const H6 = story('h6');
