import preview from '#storybook/preview';

import { DateTimeUTC } from './DateTimeUTC';

const meta = preview.meta({ component: DateTimeUTC });

export const Primary = meta.story({
  args: {
    input: new Date(),
  },
});
