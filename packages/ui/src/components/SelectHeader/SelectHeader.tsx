import { type ComponentProps } from 'react';

import { ArrowDownIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import styles from './SelectHeader.module.scss';

export type SelectHeaderProps = ComponentProps<'button'>;

export function SelectHeader({
  className,
  children,
  ...rest
}: SelectHeaderProps) {
  return (
    <button className={classNames(styles.header, className)} {...rest}>
      {children}

      <ArrowDownIcon />
    </button>
  );
}
