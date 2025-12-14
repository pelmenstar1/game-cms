import preview from '#storybook/preview';

import { SeePasswordIcon } from '.';

const meta = preview.meta({ component: SeePasswordIcon });

export const Primary = meta.story({
  args: {
    active: true,
  },
});
