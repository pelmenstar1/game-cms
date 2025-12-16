import preview from '#storybook/preview';

import { ReadonlyTextInput } from './ReadonlyTextInput';

const meta = preview.meta({ component: ReadonlyTextInput });

export const Primary = meta.story({
  args: {
    text: 'Abc',
    style: { width: 'fit-content' },
  },
});
