import '@game-cms/ui/theme/global';

import type { Preview } from '@storybook/react';
import { Providers } from '../src/app/providers';

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
        <Providers>
          <Stub />
        </Providers>
      );
    },
  ],
};

export default preview;
