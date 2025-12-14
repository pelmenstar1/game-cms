import type { ComponentProps, PropsWithChildren } from 'react';
import { Link, type LinkProps } from 'react-router';

import type { PageUrl } from '../../types/options';
import { classNames } from '../../utils/classNames';
import { Button, type ButtonProps } from '../Button';
import styles from './LinkButton.module.scss';

interface OwnProps {
  icon?: boolean;
}

export type LinkButtonProps = PropsWithChildren<
  (
    | (Omit<LinkProps, 'to'> & { to: PageUrl; realNavigation?: false })
    | (ComponentProps<'a'> & { realNavigation: true })
  ) &
    ButtonProps &
    OwnProps
>;

export function LinkButton({
  className,
  realNavigation,
  icon,
  buttonVariant,
  ...rest
}: LinkButtonProps) {
  return (
    <Button
      as={realNavigation ? 'a' : Link}
      className={classNames(
        styles.root,
        icon && styles['root-icon'],
        icon && buttonVariant === 'outlined' && styles['root-icon-outlined'],
        className
      )}
      buttonVariant={buttonVariant}
      {...rest}
    />
  );
}
