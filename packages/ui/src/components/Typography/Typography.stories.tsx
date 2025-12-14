import type { Meta, StoryObj } from '@storybook/react';

import { Typography, type TypographyVariant } from '.';

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

export const Body: unknown = story('body');
export const BodyLarge: unknown = story('bodyLarge');
export const H1: unknown = story('h1');
export const H2: unknown = story('h2');
export const H3: unknown = story('h3');
export const H4: unknown = story('h4');
export const H5: unknown = story('h5');
export const H6: unknown = story('h6');
