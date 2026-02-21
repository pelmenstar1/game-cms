import '../src/theme/global.scss';

import { ModalProvider } from '../src/hooks/useModal';

import { NotificationWrapper } from '../src/components/Notification';
import { createRoutesStub } from 'react-router';

import {
  definePreview,
  type ReactPreview,
  type ReactTypes,
} from '@storybook/react-vite';

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
          <ModalProvider>
            <Stub />
          </ModalProvider>
        </NotificationWrapper>
      );
    },
  ],
});

export default preview;
