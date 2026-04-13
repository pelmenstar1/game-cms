import { useState } from 'react';

import preview from '#storybook/preview';

import { NumberInput, type NumberInputProps } from './NumberInput';

function Component(rest: Omit<NumberInputProps, 'text' | 'onTextChanged'>) {
  const [text, setText] = useState('');

  return <NumberInput text={text} onTextChanged={setText} {...rest} />;
}

const meta = preview.meta({ component: Component });

export const NonBound = meta.story();

export const BoundInteger = meta.story({
  args: {
    min: 1,
    max: 10,
    integer: true,
  },
});
