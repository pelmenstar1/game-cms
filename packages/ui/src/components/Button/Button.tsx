import { classNames } from '../../utils/classNames';
import { impersonatedComponent } from '../../utils/impersonation';
import { Typography } from '../Typography';
import styles from './Button.module.scss';

type ButtonVariant = 'flat' | 'solid' | 'outlined' | 'flat-inverted';
type ButtonColor = 'primary';

export interface ButtonProps {
  hasIcon?: boolean;
  disabled?: boolean;
  className?: string;
  buttonVariant?: ButtonVariant;
  color?: ButtonColor;
}

export const Button = impersonatedComponent<ButtonProps, 'button'>(
  ({
    as = 'button',
    buttonVariant = 'flat',
    color = 'primary',
    className,
    disabled,
    ...rest
  }) => {
    return (
      <Typography
        as={as}
        disabled={disabled}
        className={classNames(
          styles.root,
          styles[`root-variant-${buttonVariant}`],
          styles[`root-color-${color}`],
          className
        )}
        {...rest}
      />
    );
  }
);
