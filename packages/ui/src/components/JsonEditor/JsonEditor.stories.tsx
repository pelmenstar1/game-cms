import { useState } from 'react';

import preview from '#storybook/preview';

import { JsonEditor, type JsonEditorProps } from './JsonEditor';

function Component(props: JsonEditorProps) {
  const [text, setText] = useState(props.text);

  return <JsonEditor {...props} text={text} onTextChanged={setText} />;
}

const meta = preview.meta({ component: Component });

export const Primary = meta.story({
  args: {
    text: '{}',
    allowEmpty: true,
  },
});
