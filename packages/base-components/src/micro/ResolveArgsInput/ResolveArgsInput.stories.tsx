import { useState } from 'react';

import preview from '#storybook/preview.js';

import { ArgItem, ResolveArgsInput } from './ResolveArgsInput.js';

function Component() {
  const [args, setArgs] = useState<ArgItem[]>([]);

  return <ResolveArgsInput args={args} onArgsChanged={setArgs} />;
}

const meta = preview.meta({ component: Component });

export const Primary = meta.story({
  args: {},
});
