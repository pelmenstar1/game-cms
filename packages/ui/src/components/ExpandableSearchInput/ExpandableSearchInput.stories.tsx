import { useState } from 'react';

import preview from '#storybook/preview';

import { ExpandableSearchInput } from './ExpandableSearchInput';

function Component() {
  const [text, setText] = useState('');

  return <ExpandableSearchInput text={text} onTextChanged={setText} />;
}

const meta = preview.meta({ component: Component });

export const Primary = meta.story({
  args: {},
});
