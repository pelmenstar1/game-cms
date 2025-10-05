import { ComponentProps } from 'react';

import { ArrowDownIcon } from '../../icons';

import styles from './SelectHeader.module.scss';
import { classNames } from '../../utils/classNames';

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
