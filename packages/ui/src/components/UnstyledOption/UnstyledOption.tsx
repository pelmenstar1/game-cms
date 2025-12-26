import { type ComponentProps, useId } from 'react';

import { classNames } from '../../utils/classNames';
import { Typography, type TypographyProps } from '../Typography';
import styles from './UnstyledOption.module.scss';

export interface UnstyledOptionProps
  extends ComponentProps<'input'>, TypographyProps {
  inputClassName?: string;
  type: 'radio' | 'checkbox';
}

export function UnstyledOption({
  className,
  inputClassName,
  disabled,
  variant,
  weight,
  children,
  ...inputProps
}: UnstyledOptionProps) {
  const inputId = useId();

  return (
    <Typography
      className={classNames(
        styles.root,
        disabled && styles['root-disabled'],
        className
      )}
      variant={variant}
      weight={weight}
      htmlFor={inputId}
      as="label"
    >
      <input
        id={inputId}
        disabled={disabled}
        className={classNames(styles['input'], inputClassName)}
        {...inputProps}
      />
      {children}
    </Typography>
  );
}
