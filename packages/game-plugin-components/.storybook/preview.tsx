import { NotificationWrapper } from '@game-cms/ui';
import '@game-cms/ui/theme/global';

import {
  definePreview,
  type ReactPreview,
  type ReactTypes,
} from '@storybook/react-vite';

import { createRoutesStub } from 'react-router';

const preview: ReactPreview<ReactTypes & { csf4: true }> = definePreview({
  addons: [],
  decorators: [
    (Story) => {
      const Stub = createRoutesStub([
        {
          path: '/',
          Component: Story,
        },
      ]);

      return (
        <NotificationWrapper>
          <Stub />
        </NotificationWrapper>
      );
    },
  ],
});

export default preview;
