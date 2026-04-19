import type { ComponentProps } from 'react';

import { classNames } from '../../utils/classNames';
import styles from './AutoSizeInput.module.scss';

export interface AutoSizeInputProps extends ComponentProps<'input'> {
  inputClassName?: string;
  onTextChanged?: (text: string) => void;
}

export function AutoSizeInput({
  className,
  inputClassName,
  value,
  onChange,
  onTextChanged,
  ref,
  ...rest
}: AutoSizeInputProps) {
  return (
    <div className={classNames(styles.root, className)} data-value={value}>
      <input
        ref={ref}
        value={value}
        className={inputClassName}
        onChange={(event) => {
          onChange?.(event);
          onTextChanged?.(event.target.value);
        }}
        {...rest}
      />
    </div>
  );
}
