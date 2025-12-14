import preview from '#storybook/preview';

import { Button } from '../Button';
import { Typography } from '../Typography';
import { ModalDialog } from '.';

const meta = preview.meta({ component: ModalDialog });

export const Primary = meta.story({
  args: {
    title: 'Title',
    children: <Typography>Content</Typography>,
    onClose: () => {},
    footer: (
      <>
        <Button>Cancel</Button>
        <Button buttonVariant="solid">OK</Button>
      </>
    ),
  },
});
