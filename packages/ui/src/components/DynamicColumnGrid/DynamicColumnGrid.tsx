import type { CSSProperties } from 'react';
import { createElement } from 'react';

import { classNames } from '../../utils/classNames';
import { impersonatedComponent } from '../../utils/impersonation';
import styles from './DynamicColumnGrid.module.scss';

export type DynamicColumnGridProps = {
  className?: string;
  style?: CSSProperties;
  columns: number;
  distribution?: 'even' | 'arbitrary';
};

export const DynamicColumnGrid = impersonatedComponent<
  DynamicColumnGridProps,
  'div'
>(
  ({
    className,
    columns,
    style,
    distribution = 'arbitrary',
    as = 'div',
    ...rest
  }) => {
    const templateWidth =
      distribution === 'even' ? `${(100 / columns).toFixed(3)}%` : '1fr';

    return createElement(as, {
      className: classNames(styles.root, className),
      style: {
        ...style,
        gridTemplateColumns: `repeat(${columns}, ${templateWidth})`,
      },
      ...rest,
    });
  }
);
