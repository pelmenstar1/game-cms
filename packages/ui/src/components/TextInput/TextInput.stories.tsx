import preview from '#storybook/preview';

import { TextInput } from '.';

const meta = preview.meta({ component: TextInput });

export const Bordered = meta.story({
  args: {
    value: 'Text',
  },
});

export const Underline = meta.story({
  args: {
    variant: 'underline',
    value: 'Text',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

export const Error = meta.story({
  args: {
    error: 'Error',
  },
});
