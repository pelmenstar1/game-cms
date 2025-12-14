import { useState } from 'react';

import preview from '#storybook/preview';

import { TextArea, type TextAreaProps } from '.';

function StatefulTextArea({ value, ...rest }: TextAreaProps) {
  const [text, setText] = useState(value);

  return <TextArea value={text} onTextChanged={setText} {...rest} />;
}

const meta = preview.meta({ component: StatefulTextArea });

export const Primary = meta.story({
  args: {
    value: 'Some text',
  },
});
