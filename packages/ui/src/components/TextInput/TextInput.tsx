import { ComponentProps, ReactNode, Ref } from 'react';

import { classNames } from '../../utils/classNames';
import { Typography } from '../Typography';
import styles from './TextInput.module.scss';

export type TextInputVariant = 'bordered' | 'underline';

export interface TextInputProps extends ComponentProps<'input'> {
  error?: string | boolean;
  endContent?: ReactNode;
  type?: 'text' | 'password' | 'email' | 'tel';
  variant?: TextInputVariant;
  ref?: Ref<HTMLInputElement>;

  onTextChanged?: (text: string) => void;
}

export function TextInput({
  className,
  error,
  disabled,
  variant = 'bordered',
  endContent,
  ref,
  onChange,
  onTextChanged,
  ...rest
}: TextInputProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <div
        className={classNames(
          styles.input,
          styles[`input-variant-${variant}`],
          error && styles['input-error'],
          disabled && styles['input-disabled']
        )}
      >
        <Typography
          as="input"
          type="text"
          ref={ref}
          disabled={disabled}
          onChange={
            onChange ??
            ((event) => {
              onTextChanged?.(event.target.value);
            })
          }
          {...rest}
        />

        {endContent && (
          <div className={styles['end-content']}>{endContent}</div>
        )}
      </div>

      {error && <Typography className={styles.error}>{error}</Typography>}
    </div>
  );
}
