import preview from '#storybook/preview';

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
