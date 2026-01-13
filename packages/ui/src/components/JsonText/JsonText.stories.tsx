import preview from '#storybook/preview';

import { JsonText } from './JsonText';

const meta = preview.meta({ component: JsonText });

export const Primary = meta.story({
  args: {
    text: '{ "abc": 123 }',
  },
});
