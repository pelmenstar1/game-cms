import { type TimeSpec } from '@game-cms/shared/chrono';
import { useState } from 'react';

import preview from '#storybook/preview';

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

const meta = preview.meta({ component: Component });

export const Primary = meta.story({
  args: {},
});
