import '../src/theme/global.scss';

import type { Preview } from '@storybook/react';

import { NotificationWrapper } from '../src/components/Notification';
import { createRoutesStub } from 'react-router';

const preview: Preview = {
  decorators: [
    (Story) => {
       const Stub = createRoutesStub([
        {
          path: '/',
          Component: Story ,
        },
      ]);

      return (
          <NotificationWrapper>
            <Stub />
          </NotificationWrapper>
      );
    },
  ],
};

export default preview;
