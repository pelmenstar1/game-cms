import { type TimeSpec } from '@game-cms/shared/chrono';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { TimeSelect } from './TimeSelect';

function Component() {
  const [selectedItem, setSelectedItem] = useState<TimeSpec>('30d');

  return (
    <TimeSelect
      suggestions={['30d', '60d', '90d']}
      selectedItem={selectedItem}
      onItemSelected={setSelectedItem}
    />
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {},
};
