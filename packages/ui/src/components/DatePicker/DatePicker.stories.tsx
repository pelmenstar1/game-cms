import { useState } from 'react';

import preview from '#storybook/preview';

import { DatePicker, type DatePickerProps } from './DatePicker';

function Component(props: DatePickerProps) {
  const [value, setValue] = useState(props.value);

  return <DatePicker {...props} value={value} onValueChanged={setValue} />;
}

const meta = preview.meta({ component: Component });

export const Primary: unknown = meta.story({
  args: {
    value: new Date(),
  },
});
