import '@game-cms/ui/theme/global';

import { NotificationWrapper } from '@game-cms/ui';
import {
  definePreview,
  type ReactPreview,
  type ReactTypes,
} from '@storybook/react-vite';
import { createRoutesStub } from 'react-router';

import { SessionProvider } from './stubs/SessionProvider.js';

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
          <SessionProvider>
            <Stub />
          </SessionProvider>
        </NotificationWrapper>
      );
    },
  ],
});

export default preview;
