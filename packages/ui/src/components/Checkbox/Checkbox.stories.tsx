import preview from '#storybook/preview';

import { Checkbox } from '.';

const meta = preview.meta({ component: Checkbox });

export const Primary = meta.story({
  args: {
    children: 'text',
  },
});

export const PrimaryDisabled = meta.story({
  args: {
    disabled: true,
    children: 'text',
  },
});

export const PrimaryH4 = meta.story({
  args: {
    variant: 'h4',
    children: 'text',
  },
});
