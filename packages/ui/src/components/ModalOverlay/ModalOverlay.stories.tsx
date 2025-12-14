import preview from '#storybook/preview';

import { Typography } from '../Typography';
import { ModalOverlay } from '.';

function Component({ effect }: { effect: 'tint' | 'blur' }) {
  return (
    <div>
      <Typography>Some content</Typography>

      <ModalOverlay effect={effect} />
    </div>
  );
}

const meta = preview.meta({ component: Component });

export const Tint = meta.story({
  args: { effect: 'tint' },
});

export const Blur = meta.story({
  args: { effect: 'blur' },
});
