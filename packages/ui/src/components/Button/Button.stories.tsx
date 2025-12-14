import preview from '#storybook/preview';

import { Button } from '.';

const meta = preview.meta({ component: Button });

export const Solid = meta.story({
  args: {
    buttonVariant: 'solid',
    children: 'Solid',
  },
});

export const SolidDisabled = meta.story({
  args: {
    buttonVariant: 'solid',
    disabled: true,
    children: 'Solid',
  },
});

export const Outlined = meta.story({
  args: {
    buttonVariant: 'outlined',
    children: 'Outlined',
  },
});

export const OutlinedDisabled = meta.story({
  args: {
    buttonVariant: 'outlined',
    disabled: true,
    children: 'Outlined',
  },
});

export const Flat = meta.story({
  args: {
    buttonVariant: 'flat',
    children: 'Flat',
  },
});

export const FlatDisabled = meta.story({
  args: {
    buttonVariant: 'flat',
    disabled: true,
    children: 'Flat',
  },
});
