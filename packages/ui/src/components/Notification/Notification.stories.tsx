import { type ReactNode } from 'react';

import preview from '#storybook/preview';

import { Button } from '../Button';
import { NotificationWrapper } from '.';
import { useNotification } from './NotificationContext';
import type { NotificationType } from './types';

function Component({
  type,
  addon,
}: {
  type: NotificationType;
  addon?: ReactNode;
}) {
  const notification = useNotification();

  return (
    <NotificationWrapper>
      <button
        onClick={() => {
          notification[type](addon ? { message: 'Message', addon } : 'Message');
        }}
      >
        Show
      </button>
    </NotificationWrapper>
  );
}

const meta = preview.meta({ component: Component });

export const Plain = meta.story({
  args: {
    type: 'info',
  },
});

export const Error = meta.story({
  args: {
    type: 'error',
  },
});

export const WithAddon = meta.story({
  args: {
    type: 'info',
    addon: <Button buttonVariant="outlined">Details</Button>,
  },
});
