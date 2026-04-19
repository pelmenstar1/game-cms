import type { FC } from 'react';

import { classNames } from '../utils/classNames';
import styles from './google.module.scss';
import type { SvgProps } from './types';

/*@__NO_SIDE_EFFECTS__*/
export function googleIcon(d: string) {
  const component: FC<SvgProps> = ({ className, ...rest }) => {
    return (
      <svg
        width="24px"
        height="24px"
        viewBox="0 -960 960 960"
        className={classNames(styles['google-icon'], className)}
        {...rest}
      >
        <path d={d} />
      </svg>
    );
  };
  component.displayName = 'GoogleIcon';

  return component;
}
