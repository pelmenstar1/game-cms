import { ComponentProps, PropsWithChildren } from 'react';
import { Link, LinkProps } from 'react-router';

import { classNames } from '../../utils/classNames';
import { Button, ButtonProps } from '../Button';
import styles from './LinkButton.module.scss';

export type LinkButtonProps = PropsWithChildren<
  (
    | (LinkProps & { realNavigation?: false })
    | (ComponentProps<'a'> & { realNavigation: true })
  ) &
    ButtonProps
>;

export function LinkButton({
  className,
  realNavigation,
  ...rest
}: LinkButtonProps) {
  return (
    <Button
      as={realNavigation ? 'a' : Link}
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
