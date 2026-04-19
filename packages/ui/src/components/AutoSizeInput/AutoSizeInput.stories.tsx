import { useState } from 'react';

import preview from '#storybook/preview';

import { AutoSizeInput, type AutoSizeInputProps } from '.';

function Component(props: Omit<AutoSizeInputProps, 'value' | 'onTextChanged'>) {
  const [value, setValue] = useState('');

  return (
    <div>
      <AutoSizeInput value={value} onTextChanged={setValue} {...props} />
    </div>
  );
}

const meta = preview.meta({ component: Component });

export const Primary = meta.story({
  args: {
    style: {
      border: '1px solid white',
    },
  },
});
