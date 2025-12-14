import type { Meta, StoryObj } from '@storybook/react';

import { type NotificationType, NotificationWrapper, useNotification } from '.';

function Component({ type }: { type: NotificationType }) {
  const notification = useNotification();

  return (
    <NotificationWrapper>
      <button
        onClick={() => {
          notification[type]('Message');
        }}
      >
        Show
      </button>
    </NotificationWrapper>
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Plain: Story = {
  args: {
    type: 'info',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
  },
};
