import '@game-cms/ui/theme/global';

import {
  definePreview,
  type ReactPreview,
  type ReactTypes,
} from '@storybook/react-vite';
import { Providers } from '../src/app/providers';

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
        <Providers>
          <Stub />
        </Providers>
      );
    },
  ],
});

export default preview;
