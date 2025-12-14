import { useState } from 'react';

import { SeePasswordIcon } from '../../icons/SeePasswordIcon';
import { classNames } from '../../utils/classNames';
import { IconButton } from '../IconButton';
import { TextInput, type TextInputProps } from '../TextInput';
import styles from './PasswordInput.module.scss';

interface PasswordInputProps extends Omit<
  TextInputProps,
  'endContent' | 'type'
> {
  autoComplete?: 'current-password' | 'new-password';
}

export function PasswordInput({
  className,
  onTextChanged,
  disabled,
  ...rest
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      {...rest}
      className={classNames(className, styles.root)}
      disabled={disabled}
      type={showPassword ? 'text' : 'password'}
      endContent={
        <IconButton
          onClick={() => {
            setShowPassword((state) => !state);
          }}
          className={styles['show-password-button']}
          title={showPassword ? 'Приховати пароль' : 'Показати пароль'}
          rounding="circle"
          disabled={disabled}
        >
          <SeePasswordIcon active={showPassword} />
        </IconButton>
      }
      onTextChanged={(text) => {
        setShowPassword(false);
        onTextChanged?.(text);
      }}
    />
  );
}
