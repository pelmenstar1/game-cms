import { createElement, type ReactNode } from 'react';

import { classNames } from '../../utils/classNames';
import { impersonatedComponent } from '../../utils/impersonation';
import styles from './IconComponentBase.module.scss';

export type IconComponentBaseProps = {
  className?: string;
  rounding?: 'none' | 'rounded' | 'circle';
  hover?: 'background' | 'fill';

  children: ReactNode;
};

export const IconComponentBase = /*@__PURE__*/ impersonatedComponent<
  IconComponentBaseProps,
  'button'
>(
  ({
    as = 'button',
    rounding = 'rounded',
    hover = 'background',
    className,
    children,
    ...rest
  }) => {
    return createElement(
      as,
      {
        ...rest,
        className: classNames(
          styles.root,
          styles[`root-rounding-${rounding}`],
          styles[`root-hover-${hover}`],
          className
        ),
      },
      children
    );
  }
);
