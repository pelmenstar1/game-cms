import preview from '#storybook/preview';

import { WarningBlock } from './WarningBlock';

const meta = preview.meta({ component: WarningBlock });

export const Primary = meta.story({
  args: {
    children: 'Some warning',
  },
});
