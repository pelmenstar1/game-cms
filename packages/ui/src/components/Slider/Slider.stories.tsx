import { useState } from 'react';

import preview from '#storybook/preview';

import { Slider, type SliderProps } from './Slider';

const meta = preview.meta({
  component: (props: Omit<SliderProps, 'value'>) => {
    const [value, setValue] = useState(0);

    return <Slider {...props} value={value} onValueChanged={setValue} />;
  },
});

export const Primary = meta.story({
  args: {
    min: 0,
    max: 10,
    style: {
      width: '100px',
    },
  },
});
