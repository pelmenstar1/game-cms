import preview from '#storybook/preview';

import { ErrorBoard } from '.';

const meta = preview.meta({ component: ErrorBoard });

export const Primary = meta.story({
  args: { items: ['Error 1', 'Error 2'] },
});
