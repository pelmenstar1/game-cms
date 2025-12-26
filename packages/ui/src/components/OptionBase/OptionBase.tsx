import type { ComponentProps } from 'react';

import { classNames } from '../../utils/classNames';
import type { TypographyVariant } from '../Typography';
import { UnstyledOption } from '../UnstyledOption';
import styles from './OptionBase.module.scss';

export interface OptionBaseProps extends Omit<
  ComponentProps<'input'>,
  'value'
> {
  type: 'radio' | 'checkbox';
  variant?: TypographyVariant;
  onCheckedChanged?: (state: boolean) => void;
}

export function OptionBase({
  className,
  disabled,
  onCheckedChanged,
  ...rest
}: OptionBaseProps) {
  return (
    <UnstyledOption
      className={classNames(
        styles.root,
        disabled && styles['root-disabled'],
        className
      )}
      disabled={disabled}
      onChange={(event) => {
        const state = event.target.checked;

        onCheckedChanged?.(state);
      }}
      {...rest}
    />
  );
}
