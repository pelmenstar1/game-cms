import type { FC } from 'react';

import type { SvgProps } from './types';

/*@__NO_SIDE_EFFECTS__*/
export function googleIcon(d: string) {
  const component: FC<SvgProps> = (props) => {
    return (
      <svg width="24px" height="24px" viewBox="0 -960 960 960" {...props}>
        <path d={d} />
      </svg>
    );
  };
  component.displayName = 'GoogleIcon';

  return component;
}
