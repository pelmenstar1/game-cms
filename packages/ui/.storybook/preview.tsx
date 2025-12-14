import '../src/theme/global.scss';

import type { Preview } from '@storybook/react';
import { useModal } from '../src/hooks/useModal';

import { NotificationWrapper } from '../src/components/Notification';
import { createRoutesStub } from 'react-router';

const preview: Preview = {
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
          <useModal.Provider>
            <Stub />
          </useModal.Provider>
        </NotificationWrapper>
      );
    },
  ],
};

export default preview;
