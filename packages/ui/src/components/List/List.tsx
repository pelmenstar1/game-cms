import { ComponentProps } from 'react';

import styles from './List.module.scss';
import { classNames } from '../../utils/classNames';

type ListProps = ComponentProps<'ul'>;

export function List({ className, ...rest }: ListProps) {
  return <ul className={classNames(styles.root, className)} {...rest} />;
}
