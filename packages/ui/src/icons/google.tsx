import { FC } from 'react';

import { SvgProps } from './types';

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
